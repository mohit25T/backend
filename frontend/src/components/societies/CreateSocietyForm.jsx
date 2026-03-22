import { useState } from "react";

const CreateSocietyForm = ({ onSubmit, loading }) => {

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [wingCount, setWingCount] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // 🔥 Validation
    if (!name.trim()) {
      setError("Society name is required");
      return;
    }

    if (wingCount < 1 || wingCount > 26) {
      setError("Wing count must be between 1 and 26");
      return;
    }

    /* GENERATE WINGS */
    const wings = Array.from({ length: wingCount }, (_, i) =>
      String.fromCharCode(65 + i) // A, B, C...
    );

    onSubmit({
      name: name.trim(),
      city: city.trim(),
      wings
    });
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        Create Society
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* SOCIETY NAME */}
        <input
          type="text"
          placeholder="Society Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* CITY */}
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* WING COUNT */}
        <div>
          <label className="text-sm text-gray-600">
            Number of Wings
          </label>

          <input
            type="number"
            min="1"
            max="26" // 🔥 updated (A-Z safe)
            value={wingCount}
            onChange={(e) =>
              setWingCount(Number(e.target.value))
            }
            className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* PREVIEW WINGS */}
        <div className="text-sm text-gray-600">
          Wings:{" "}
          {Array.from({ length: wingCount }, (_, i) => (
            <span
              key={i}
              className="inline-block bg-gray-200 px-2 py-1 rounded mr-1"
            >
              {String.fromCharCode(65 + i)}
            </span>
          ))}
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Society"}
        </button>

      </form>
    </>
  );
};

export default CreateSocietyForm;