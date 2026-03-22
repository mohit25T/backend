import { useState } from "react";

const CreateSocietyForm = ({ onSubmit, loading }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [wingCount, setWingCount] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedCity = city.trim();

    // 🔥 VALIDATION
    if (!trimmedName) {
      setError("Society name is required");
      return;
    }

    if (!Number.isInteger(wingCount) || wingCount < 1 || wingCount > 26) {
      setError("Wing count must be between 1 and 26");
      return;
    }

    /* 🔥 GENERATE WINGS (A-Z) */
    const wings = Array.from({ length: wingCount }, (_, i) =>
      String.fromCharCode(65 + i),
    );

    onSubmit({
      name: trimmedName,
      city: trimmedCity,
      wings,
    });
  };

  /* 🔥 HANDLE WING INPUT SAFELY */
  const handleWingChange = (value) => {
    const num = Number(value);

    if (isNaN(num)) {
      setWingCount(1);
      return;
    }

    if (num < 1) {
      setWingCount(1);
    } else if (num > 26) {
      setWingCount(26);
    } else {
      setWingCount(num);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Create Society</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SOCIETY NAME */}
        <input
          type="text"
          placeholder="Society Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          <label className="text-sm text-gray-600">Number of Wings</label>

          <input
            type="number"
            min="1"
            max="26"
            value={wingCount}
            onChange={(e) => handleWingChange(e.target.value)}
            className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* PREVIEW WINGS */}
        <div className="text-sm text-gray-600">
          Wings:{" "}
          {Array.from({ length: wingCount }, (_, i) => (
            <span
              key={i}
              className="inline-block bg-gray-200 px-2 py-1 rounded mr-1 mb-1"
            >
              {String.fromCharCode(65 + i)}
            </span>
          ))}
        </div>

        {/* ERROR */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* SUBMIT */}
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