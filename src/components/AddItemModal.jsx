import React, { useState } from "react";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

// List of all food categories
const CATEGORIES = [
    "Starters", "Soups", "Salads", "Rice Dishes", "Noodles", "Kottu",
    "Chicken Dishes", "Seafood", "Beef & Mutton", "Vegetarian Dishes",
    "Burgers & Sandwiches", "Pizza", "Snacks", "Desserts", "Beverages",
    "Fresh Juices", "Tea & Coffee", "Combo Meals", "Kids Meals", "Chef Specials",
];

export default function AddItemModal({ onClose, editItem }) {


const { user } = useAuth();
const [form, setForm] = useState({
    category:    editItem?.category    || "",
    itemName:    editItem?.itemName    || "",
    description: editItem?.description || "",
    price:       editItem?.price       || "",
    });

const [imageFile, setImageFile] = useState(null);
const [loading, setLoading]     = useState(false);
const [error, setError]         = useState("");


const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

// save button logic
const handleSave = async () => {setError("");

// Basic of  these 3 fields must be filled
if (!form.category || !form.itemName || !form.price)
return setError("Category, name and price are required.");

setLoading(true);
try { let imageUrl = editItem?.imageUrl || "";
if (imageFile) {
        
// upload the image to firebase storage quary 
const imgRef = ref(storage, `menuImages/${user.uid}/${Date.now()}_${imageFile.name}`);
await uploadBytes(imgRef, imageFile);
imageUrl = await getDownloadURL(imgRef);
}

//  Save to Firestore database
if (editItem) {
await updateDoc(doc(db, "menuItems", editItem.id), {...form,
price: parseFloat(form.price),imageUrl,
});

} else {
// Add new item to menuItems card
await addDoc(collection(db, "menuItems"), {...form,price:parseFloat(form.price),
    imageUrl,
    restaurantId:user.uid,
    isAvailable:true,
    createdAt:serverTimestamp(),
    });
}

onClose();} catch {
setError("Failed to save. Please try again.");}
setLoading(false);
};

return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">

{/* popup box */}
<div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

    
<div className="flex items-center justify-between mb-5">
<h3 className="text-lg font-bold text-gray-800">
<i className="fa fa-bowl-food mr-2 text-blue-600"></i>
            
{/*  Add New Item */}
{editItem ? "Edit Item" : "Add New Item"}</h3>
    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
        <i className="fa fa-xmark"></i>
    </button>
</div>

{/* Show error message */}
{error && (
    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">{error}
    </div>
)}


<div className="space-y-4">

{/* Category box */}
<div><label className="block text-sm font-semibold text-gray-600 mb-1">Category</label>
<select name="category" value={form.category} onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400">
    <option value="">-- Select Category --</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
</select>
</div>

{/* Food name text input */}
<div>
    <label className="block text-sm font-semibold text-gray-600 mb-1">Food Name</label>
    <input name="itemName" placeholder="e.g. Chicken Fried Rice"value={form.itemName} onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
</div>


<div>
<label className="block text-sm font-semibold text-gray-600 mb-1">
Description <span className="text-gray-400 font-normal">(optional)</span></label>
<textarea name="description" rows={2} placeholder="Short description..."
value={form.description} onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"/>
</div>

{/* Price input — numbers only */}
<div>
<label className="block text-sm font-semibold text-gray-600 mb-1">Price (LKR)</label>
            <input name="price" type="number" placeholder="e.g. 350"
value={form.price} onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
</div>

{/* Image upload */}
<div>
<label className="block text-sm font-semibold text-gray-600 mb-2">
<i className="fa fa-image mr-1 text-gray-400"></i>Upload Image (PNG / JPG)
</label>

{editItem?.imageUrl && !imageFile && (
<img src={editItem.imageUrl} alt="" className="w-20 h-16 object-cover rounded-lg mb-2 border" />)}
            
{/*  only allows PNG and JPG */}
<input type="file" accept="image/png,image/jpeg"
onChange={(e) => setImageFile(e.target.files[0])}
className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-semibold hover:file:bg-blue-100 cursor-pointer"/>
    </div>
</div>

{/* Save and Cancel buttons */}
<div className="flex gap-3 mt-6">
<button onClick={handleSave} disabled={loading}
className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
{loading ? "Saving..." : "Save Item"}
</button>


<button onClick={onClose}
className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg text-sm transition-colors">Cancel</button>
</div>
</div>
</div>
);
}