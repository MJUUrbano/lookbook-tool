# Lookbook Tool

A simple React tool that allows you to upload an image, add product points, and copy the data as a JSON text. This helps streamline the creation of lookbook objects for Jewelmer.

## Features

- Upload an image for annotation.
- Click on the image or click the add product button to add product points with Shopify product handles.
- Copy the annotated data as a JSON.

## Installation

1. Clone this repository:

   ```sh
   git clone https://github.com/your-username/lookbook-tool.git
   cd lookbook-tool
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Run the development server:
   ```sh
   npm run dev
   ```

## Usage

1. Upload an image using the file input.
2. Click on the image to add product points (enter the Shopify product handle when prompted).
3. Click the "Copy JSON" button to copy the lookbook data.

## JSON Output Format

```json
{
  "product_list": [
    { "product_handle": "product-handle-1", "x": 0.523, "y": 0.341 },
    { "product_handle": "product-handle-2", "x": 0.732, "y": 0.682 }
  ]
}
```

## Tech Stack

- **React** (Vite)
- **TypeScript**
- **Tailwind CSS** (for styling)

## License

MIT License.
