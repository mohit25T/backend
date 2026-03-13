import { useState } from "react";

const CreateSocietyForm = ({ onSubmit, loading }) => {

  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const [wingCount, setWingCount] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    /* GENERATE WINGS */
    const wings = Array.from({ length: wingCount }, (_, i) =>
      String.fromCharCode(65 + i) // A B C D
    );

    onSubmit({
      name,
      city,
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
          className="w-full border p-2 rounded"
        />

        {/* CITY */}

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* WING COUNT */}

        <div>
          <label className="text-sm text-gray-600">
            Number of Wings
          </label>

          <input
            type="number"
            min="1"
            max="10"
            value={wingCount}
            onChange={(e) =>
              setWingCount(Number(e.target.value))
            }
            className="w-full border p-2 rounded mt-1"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Creating..." : "Create Society"}
        </button>

      </form>
    </>
  );
};

export default CreateSocietyForm;