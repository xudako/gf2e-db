import json

# Define your input and output file paths
input_file = 'PropertyData.json'
output_file = 'PropData.json'

# Prefixes to match
prefixes = ('655', '1000', '11', '41', '8', '9999')

# Load the JSON data
with open(input_file, 'r') as f:
    data = json.load(f)

# Filter the data
filtered_data = {
    "data": [obj for obj in data["data"] if str(obj["id"]).startswith(prefixes)]
}

# Save the filtered data
with open(output_file, 'w') as f:
    json.dump(filtered_data, f, indent=2)

print(f"Filtered {len(filtered_data['data'])} entries saved to {output_file}")
