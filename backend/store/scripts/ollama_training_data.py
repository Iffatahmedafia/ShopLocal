from store.models import Product, Brand
import os

output_path = os.path.join("store", "training_data", "chatbot_finetune_data.txt")
os.makedirs(os.path.dirname(output_path), exist_ok=True)

def format_tags(tags):
    if isinstance(tags, list):
        return ", ".join(tags)
    if isinstance(tags, str):
        return tags
    return ", ".join([tag.name for tag in tags.all()]) if hasattr(tags, 'all') else ""



with open(output_path, "w") as f:
    # Add greeting instructions first
    greetings = {
        "hi": "Hi there! How can I help you today?",
        "hello": "Hello! Looking for a product or brand?",
        "hey": "Hey! What would you like to shop for today?",
        "good morning": "Good morning! Let me know if you need suggestions.",
        "good evening": "Good evening! Looking for anything specific?"
    }
    for g_instruct, g_response in greetings.items():
        f.write(f"### Instruction:\n{g_instruct}\n\n### Response:\n{g_response}\n\n")

    for product in Product.objects.filter(is_trashed=False):
        name = product.name
        description = product.description or "No description available."
        price = f"${product.price}" if product.price else "Price not listed"
        category = getattr(product.category, 'name', 'Uncategorized')
        tags = format_tags(product.tags)
        store_link = product.online_store or "Link not available."

        response = (
            f"Product Name: {name}\n"
            f"Description: {description}\n"
            f"Category: {category}\n"
            f"Tags: {tags if tags else 'No tags listed'}\n"
            f"Price: {price}\n"
            f"Buy here: {store_link}"
        )

        base_instruction = f"Tell me about the product {name}."
        f.write(f"### Instruction:\n{base_instruction}\n\n### Response:\n{response}\n\n")

        phrases = [
            f"I want a {name.lower()}",
            f"I'm looking for a {category.lower()}",
            f"Do you have any {category.lower()} items?",
            f"Can you suggest something like {name.lower()}?",
            f"Any recommendations in {category.lower()}?",
            f"I'm furnishing my home, do you have any {category.lower()}?",
            f"I need a {name.lower()} under {price}",
            f"Looking for affordable {category.lower()} under $100",
            f"I want a {name.lower()} with good reviews",
            f"Can I buy a {name.lower()} online?",
            f"I need a {category.lower()} and something else too",
        ]
        for phrase in phrases:
            f.write(f"### Instruction:\n{phrase}\n\n### Response:\n{response}\n\n")

    for brand in Brand.objects.all():
        name = brand.name
        description = getattr(brand, 'description', None) or f"{name} is a trusted brand listed in our store."
        website = getattr(brand, 'website_link', None) or "Website not available."

        instruction = f"Tell me about the brand {name}."
        response = response = f"Brand Name: {name}\nDescription: {description}\nVisit: {website}"


        f.write(f"### Instruction:\n{instruction}\n\n### Response:\n{response}\n\n")
