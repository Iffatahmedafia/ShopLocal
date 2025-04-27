import os
from dotenv import load_dotenv
from langchain_core.documents import Document
# from langchain_community.llms import HuggingFaceEndpoint
from langchain_huggingface import HuggingFaceEndpoint
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from .models import Product

load_dotenv()

# Fetch token
hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")

llm = HuggingFaceEndpoint(
    repo_id="mistralai/Mistral-7B-Instruct-v0.1",
    temperature=0.5,
    huggingfacehub_api_token=hf_token
)

def get_product_docs():
    products = Product.objects.all()
    docs = []
    for p in products:
        text = f"Product: {p.name}. Tags: {getattr(p, 'tags', '')}. Description: {p.description}. Category: {p.category.name if p.category else 'N/A'}"
        docs.append(Document(page_content=text, metadata={"id": p.id}))
    return docs

def get_vector_index():
    docs = get_product_docs()
    embedding_model = HuggingFaceEmbeddings()
    return FAISS.from_documents(docs, embedding_model)

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
                "image": product.image
            })

    return structured_output