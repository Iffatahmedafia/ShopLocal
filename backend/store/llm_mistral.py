import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from langchain_core.documents import Document
# from langchain_community.llms import HuggingFaceEndpoint
from langchain_huggingface import HuggingFaceEndpoint
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from .models import Product

load_dotenv()

data_path = os.path.join(os.path.dirname(__file__), "training_data", "chatbot_finetune_data.txt")



# Fetch token
hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")

llm = HuggingFaceEndpoint(
    repo_id="fabiochiu/t5-base-tag-generation",
    task="text2text-generation",
    huggingfacehub_api_token=hf_token
)

client = InferenceClient(
    model="fabiochiu/t5-base-tag-generation",
    token=hf_token
)

def generate_chat_response(user_input, top_k=1, similarity_threshold=0.6):
    with open(data_path, "r") as f:
        raw = f.read()

    blocks = raw.split("### Instruction:")
    docs = []
    for block in blocks:
        if "### Response:" in block:
            q, a = block.split("### Response:")
            docs.append(Document(page_content=a.strip(), metadata={"instruction": q.strip()}))

    # Load embedding model
    embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(docs, embedding_model)

    # Embed the query and documents
    query_embedding = embedding_model.embed_query(user_input)
    results = vectorstore.similarity_search_with_score_by_vector(query_embedding, k=top_k)

    if results and results[0][1] >= similarity_threshold:
        return results[0][0].page_content
    else:
        return "Sorry, I couldn't find anything relevant to your message."

def generate_tags_from_description(description, max_tags=5):
    prompt = description.strip()
    try:
        output = client.text_generation(prompt, max_new_tokens=50)
        tags = [tag.strip().lower() for tag in output.split(",") if tag.strip()]
        return tags[:max_tags]
    except Exception as e:
        print("Error generating tags:", e)
        return []



def get_product_docs():
    products = Product.objects.all()
    docs = []
    for p in products:
        text = f"Product: {p.name}. Tags: {getattr(p, 'tags', '')}. Description: {p.description}. Category: {p.category.name if p.category else 'N/A'}"
        docs.append(Document(page_content=text, metadata={"id": p.id}))
    return docs

def get_vector_index():
    docs = get_product_docs()
    try:
        embedding_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={
                "device": "cpu",  # Force CPU
                "trust_remote_code": True  # Avoid meta tensor issues
            }
        )
        return FAISS.from_documents(docs, embedding_model)

    except RuntimeError as e:
        print("Error while building vector index:", e)
        raise


def generate_recommendations(user_keywords):
    vectorstore = get_vector_index()
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
    results = retriever.get_relevant_documents(", ".join(user_keywords))

    structured_output = []
    for doc in results:
        metadata = doc.metadata
        product_id = metadata.get("id")
        product = Product.objects.filter(id=product_id).first()
        if product:
            structured_output.append({
                "id": product.id,
                "name": product.name,
                "price": str(product.price),
                "category": product.category.name if product.category else None,
                "tags": getattr(product, 'tags', ''),
                "image": product.image if product.image else None

            })
    print("Structured output preview:", structured_output)

    return structured_output

# def generate_tags_from_description(description, max_tags=5):
#     prompt = description.strip()
#     try:
#         response = llm.invoke(prompt)
#         tag_string = response.strip().lower()
#         tags = [tag.strip() for tag in tag_string.split(",") if tag.strip()]
#         return tags[:max_tags]
#     except Exception as e:
#         print("Error generating tags:", e)
#         return []