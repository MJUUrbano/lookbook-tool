import { useState, useRef } from "react";

const LookbookTool = () => {
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([
    {
      product_handle: "",
      tooltip_placement: "bottom",
      x: 50,
      y: 50,
    },
  ]);
  const imageRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { product_handle: "", tooltip_placement: "bottom", x: 50, y: 50 },
    ]);
  };

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const copyJSON = () => {
    const jsonData = JSON.stringify({ product_list: products }, null, 2);
    navigator.clipboard.writeText(jsonData);
    alert("Copied JSON to clipboard!");
  };

  return (
    <div className="flex flex-col bg-shadow-900 text-shadow-50">
      <div className="flex gap-8 p-8 max-w-5xl mx-auto">
        <div className="relative flex flex-col">
          <div className="relative">
            <div className="absolute left-0 -translate-x-1/1 top-0 flex flex-row items-center justify-between  text-xs text-shadow-50">
              <div className="rotate-270 h-fit mr-1 font-bold">
                <span>Y-AXIS</span>
              </div>
              <div className="flex flex-col justify-between h-[660px] text-xs text-shadow-50">
                {[...Array(11)].map((_, i) => (
                  <span key={i}>{100 - i * 10}</span>
                ))}
              </div>
            </div>

            <div className="w-[660px] h-[660px] border border-shadow-700 flex items-center justify-center relative bg-shadow-800">
              {image ? (
                <img
                  ref={imageRef}
                  src={image}
                  alt="Lookbook"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-shadow-100">Upload an image</span>
              )}
              {products.map((product, index) => (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${product.x}%`,
                    top: `${100 - product.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-4 h-4 bg-shadow-50 border border-shadow-50 rounded-full relative" />
                  <div
                    className="absolute bg-shadow-700 text-shadow-50 px-2 py-1 text-sm rounded"
                    style={{
                      left:
                        product.tooltip_placement === "left"
                          ? "0"
                          : product.tooltip_placement === "right"
                          ? "100%"
                          : "50%",
                      top:
                        product.tooltip_placement === "top"
                          ? "0"
                          : product.tooltip_placement === "bottom"
                          ? "100%"
                          : "50%",
                      transform:
                        product.tooltip_placement === "top"
                          ? "translate(-50%, -100%)"
                          : product.tooltip_placement === "bottom"
                          ? "translate(-50%, 0)"
                          : product.tooltip_placement === "left"
                          ? "translate(-100%, -50%)"
                          : "translate(0, -50%)",
                    }}
                  >
                    {product.product_handle
                      ? product.product_handle
                      : `Product #${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center flex-col">
              <div className="flex justify-between w-[660px] px-2 text-xs text-shadow-50">
                {[...Array(11)].map((_, i) => (
                  <span key={i}>{i * 10}</span>
                ))}
              </div>
              <div className="mr-1 font-bold">X - AXIS</div>{" "}
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="p-2 border rounded w-full border-shadow-700 bg-shadow-600 text-shadow-50"
          />
          <button
            onClick={addProduct}
            className="px-4 py-2 bg-shadow-700 text-shadow-50 rounded hover:bg-shadow-600"
          >
            Add Product
          </button>
          {products.map((product, index) => (
            <div
              key={index}
              className="p-4 border rounded space-y-2 border-shadow-700 bg-shadow-600 relative"
            >
              <button
                onClick={() => removeProduct(index)}
                className="absolute top-2 right-2 px-2 py-1 text-xs bg-shadow-600 text-shadow-50 rounded hover:bg-shadow-500"
              >
                &#x2715;
              </button>
              <label>Product handle</label>
              <input
                type="text"
                placeholder="classiques-pendant-e"
                className="p-2 border rounded w-full border-shadow-700 bg-shadow-600 text-shadow-50"
                value={product.product_handle}
                onChange={(e) =>
                  updateProduct(index, "product_handle", e.target.value)
                }
              />
              <label>X Position</label>
              <input
                type="range"
                min="0"
                max="100"
                value={product.x}
                onChange={(e) =>
                  updateProduct(index, "x", Number(e.target.value))
                }
                className="w-full accent-shadow-700"
              />
              <label>Y Position</label>
              <input
                type="range"
                min="0"
                max="100"
                value={product.y}
                onChange={(e) =>
                  updateProduct(index, "y", Number(e.target.value))
                }
                className="w-full accent-shadow-700"
              />
              <label>Tooltip Position</label>
              <select
                className="p-2 border rounded w-full border-shadow-700 bg-shadow-600 text-shadow-50"
                value={product.tooltip_placement}
                onChange={(e) =>
                  updateProduct(index, "tooltip_placement", e.target.value)
                }
              >
                <option value="bottom">Bottom</option>
                <option value="top">Top</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          ))}
        </div>
      </div>
      <textarea
        className="p-2 border rounded w-full border-shadow-700 bg-shadow-600 text-shadow-50 mt-4"
        rows="6"
        readOnly
        value={JSON.stringify({ product_list: products }, null, 2)}
      ></textarea>
      <button
        onClick={copyJSON}
        className="px-4 py-2 bg-shadow-700 text-shadow-50 rounded hover:bg-shadow-600 mt-2"
      >
        Copy JSON
      </button>
    </div>
  );
};

export default LookbookTool;
