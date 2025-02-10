from mira_sdk import CompoundFlow, Flow, MiraClient


def create_client():
    key = "sb-3431c61991c07075526bc13aa9ac4462"
    return MiraClient(config={"API_KEY": key})


def add_dataset(client):  # This should only be run once
    client.dataset.create(
        "dvenom/prompt-guidelines",
        "Guidelines for prompting LLMs, based on the paper: https://arxiv.org/pdf/2312.16171v1",
    )
    client.dataset.add_source("dvenom/prompt-guidelines", file_path="guidelines.md")


def test_prompter(client):
    flow = Flow(source="prompter.yaml")
    input_dict = {
        "res_level": "undergraduate",
        "question": "How does random forests regression work?",
        "prompter_provider": "anthropic",
        "prompter_model": "claude-3.5-sonnet",
    }
    response = client.flow.test(flow, input_dict)
    print(response)


def multiprompt(client):
    flow = CompoundFlow(source="multiprompt.yaml")
    try:
        client.flow.deploy(flow)  # Deploy to platform
        print("Compound flow deployed successfully!")  # Success message
    except Exception as e:
        print(f"Deployment error: {str(e)}")  # Handle deployment error
    input_dict = {
        "res_level": "undergraduate",
        "question": "How does random forests regression work?",
        "prompter_provider": "anthropic",
        "prompter_model": "claude-3.5-sonnet",
        "response_provider": "anthropic",
        "reponse_model": "claude-3.5-sonnet",
    }
    # response = client.flow.test(flow, input_dict)
    # print(response)


def main():
    client = create_client()
    # add_dataset(client)
    multiprompt(client)


if __name__ == "__main__":
    main()
