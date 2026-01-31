import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import api from "../api/axios";

const AddSociety = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMsg("");
      await api.post("/societies", { name, city });
      setMsg("Society created successfully");
      setName("");
      setCity("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error creating society");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageWrapper>
        <h1 className="text-2xl font-bold mb-6">Add Society</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow max-w-md space-y-4"
        >
          <input
            type="text"
            placeholder="Society Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded"
          >
            {loading ? "Creating..." : "Create Society"}
          </button>

          {msg && (
            <p className="text-sm text-center text-blue-600">
              {msg}
            </p>
          )}
        </form>
      </PageWrapper>
    </AppLayout>
  );
};

export default AddSociety;
