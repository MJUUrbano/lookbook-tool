import { useState, useRef } from "react";

const LookbookTool = () => {
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([
    {
      product_title: "",
      product_url: "",
      x: 50,
      y: 45,
      tooltip_placement: "bottom",
    },
  ]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [wasDragging, setWasDragging] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

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

  const addProduct = (e) => {
    if (wasDragging) {
      setWasDragging(false);
      return;
    }
    
    console.log(e.target.matches("button"));
    if (e.target.matches("button")) {
      setProducts([
        ...products,
        { product_title: "", product_url: "", x: 50, y: 30, tooltip_placement: "bottom" },
      ]);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / 660) * 100;
      const y = 100 - ((e.clientY - rect.top) / 660) * 100;

      setProducts([
        ...products,
        { product_title: "", product_url: "", x: x, y: y, tooltip_placement: "bottom" },
      ]);
    }
  };

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleMouseDown = (index, e) => {
    e.stopPropagation();
    setDraggedIndex(index);
    setWasDragging(false);
  };

  const handleMouseMove = (e) => {
    if (draggedIndex === null || !containerRef.current) return;

    setWasDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / 660) * 100));
    const y = Math.max(0, Math.min(100, 100 - ((e.clientY - rect.top) / 660) * 100));

    updateProduct(draggedIndex, "x", parseFloat(x.toFixed(1)));
    updateProduct(draggedIndex, "y", parseFloat(y.toFixed(1)));
  };

  const handleMouseUp = () => {
    setDraggedIndex(null);
  };

  const copyJSON = () => {
    const jsonData = JSON.stringify({ product_list: products }, null, 2);
    navigator.clipboard.writeText(jsonData);
    alert("Copied JSON to clipboard!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-shadow-900 via-shadow-800 to-gulf-blue-900">
      <div className="border-b border-shadow-700">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-5xl font-light tracking-wide text-shadow-50 text-center">
            Lookbook Tool
          </h1>
          <p className="text-center text-shadow-300 text-sm tracking-widest mt-2 uppercase">
            By Joma Urbano
          </p>
        </div>
      </div>
      <div className="flex-1 flex gap-12 p-12 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative">
            <div className="absolute left-0 -translate-x-1/1 top-0 flex flex-row items-center justify-between text-xs text-shadow-300 font-light tracking-widest">
              <div className="rotate-270 h-fit mr-1">
                <span>Y-AXIS</span>
              </div>
              <div className="flex flex-col justify-between h-[660px] text-xs text-shadow-300">
                {[...Array(11)].map((_, i) => (
                  <span key={i}>{100 - i * 10}</span>
                ))}
              </div>
            </div>

            <div
              ref={containerRef}
              className="w-[660px] h-[660px] border border-shadow-600 flex items-center justify-center relative bg-gradient-to-br from-shadow-800 to-shadow-900 shadow-2xl cursor-crosshair transition-all"
              onClick={addProduct}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {image ? (
                <img
                  ref={imageRef}
                  src={image}
                  alt="Lookbook"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-shadow-400 text-lg font-light tracking-wide">Upload an image</span>
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
                  <div
                    className="w-4 h-4 bg-gradient-to-br from-gulf-blue-300 to-gulf-blue-500 border-2 border-shadow-50 rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleMouseDown(index, e)}
                  />
                  <div
                    className="absolute bg-gradient-to-r from-gulf-blue-700 to-gulf-blue-800 text-shadow-50 px-3 py-2 text-sm rounded shadow-xl backdrop-blur-sm border border-gulf-blue-600"
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
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.product_title
                      ? product.product_title
                      : `Product #${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center flex-col">
              <div className="flex justify-between w-[660px] px-2 text-xs text-shadow-300 font-light tracking-widest">
                {[...Array(11)].map((_, i) => (
                  <span key={i}>{i * 10}</span>
                ))}
              </div>
              <div className="font-light text-shadow-300 tracking-widest text-xs mt-2">X-AXIS</div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-shadow-300 text-sm font-light tracking-wide uppercase">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="p-3 border rounded w-full border-shadow-600 bg-shadow-700 text-shadow-50 file:bg-gulf-blue-600 file:text-shadow-50 file:border-0 file:px-3 file:py-2 file:rounded file:cursor-pointer file:mr-3 hover:border-gulf-blue-600 transition-colors"
            />
          </div>
          <button
            onClick={addProduct}
            className="w-full px-6 py-3 bg-gradient-to-r from-gulf-blue-600 to-gulf-blue-700 text-shadow-50 rounded font-light tracking-wide hover:from-gulf-blue-500 hover:to-gulf-blue-600 transition-all shadow-lg hover:shadow-xl uppercase text-sm"
          >
            + Add Product
          </button>
          {products.map((product, index) => (
            <div
              key={index}
              className="p-5 border rounded space-y-4 border-shadow-600 bg-gradient-to-br from-shadow-700 to-shadow-800 relative shadow-lg hover:shadow-xl transition-all"
            >
              <button
                onClick={() => removeProduct(index)}
                className="absolute top-3 right-3 px-2 py-1 text-xs bg-red-600 text-shadow-50 rounded hover:bg-red-700 transition-colors font-light"
              >
                ✕
              </button>
              <label className="text-shadow-300 text-xs font-light uppercase tracking-wide block">Product Title</label>
              <input
                type="text"
                placeholder="Classic Pendant"
                className="p-2 border rounded w-full border-shadow-600 bg-shadow-600 text-shadow-50 focus:border-gulf-blue-500 focus:outline-none transition-colors font-light"
                value={product.product_title}
                onChange={(e) =>
                  updateProduct(index, "product_title", e.target.value)
                }
              />
              <label className="text-shadow-300 text-xs font-light uppercase tracking-wide block">Product URL</label>
              <input
                type="text"
                placeholder="https://example.com/products/classic-pendant"
                className="p-2 border rounded w-full border-shadow-600 bg-shadow-600 text-shadow-50 focus:border-gulf-blue-500 focus:outline-none transition-colors font-light text-xs"
                value={product.product_url}
                onChange={(e) =>
                  updateProduct(index, "product_url", e.target.value)
                }
              />
              <div className="space-y-2">
                <label className="text-shadow-300 text-xs font-light uppercase tracking-wide block">X Position: <span className="text-gulf-blue-300">{product.x.toFixed(1)}%</span></label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={product.x}
                  onChange={(e) =>
                    updateProduct(index, "x", Number(e.target.value))
                  }
                  className="w-full accent-gulf-blue-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-shadow-300 text-xs font-light uppercase tracking-wide block">Y Position: <span className="text-gulf-blue-300">{product.y.toFixed(1)}%</span></label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={product.y}
                  onChange={(e) =>
                    updateProduct(index, "y", Number(e.target.value))
                  }
                  className="w-full accent-gulf-blue-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-shadow-300 text-xs font-light uppercase tracking-wide block">Tooltip Position</label>
                <select
                  className="p-2 border rounded w-full border-shadow-600 bg-shadow-600 text-shadow-50 focus:border-gulf-blue-500 focus:outline-none transition-colors font-light"
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
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-shadow-700 mt-8 pt-8">
        <div className="max-w-7xl mx-auto px-8 pb-12 space-y-4">
          <label className="text-shadow-300 text-sm font-light tracking-wide uppercase block">JSON Output</label>
          <textarea
            className="max-w-full w-full p-4 border rounded border-shadow-600 bg-shadow-900 text-shadow-200 focus:border-gulf-blue-600 focus:outline-none transition-colors font-mono text-xs leading-relaxed"
            rows="8"
            readOnly
            value={JSON.stringify({ product_list: products }, null, 2)}
          ></textarea>
          <button
            onClick={copyJSON}
            className="w-full px-6 py-3 bg-gradient-to-r from-shadow-600 to-shadow-700 text-shadow-50 rounded hover:from-shadow-500 hover:to-shadow-600 transition-all shadow-lg hover:shadow-xl font-light tracking-wide uppercase text-sm"
          >
            Copy JSON to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LookbookTool;
