import Contact from "../models/Contact.js";


// ✅ CREATE CONTACT
export const createContact = async (req, res) => {
  try {
    const { name, phone, category, role, wingId } = req.body;
    const user = req.user;

    if (!name || !phone || !category) {
      return res.status(400).json({
        message: "Name, phone and category are required",
      });
    }

    const contact = await Contact.create({
      name,
      phone,
      category,
      role,
      societyId: user.societyId,
      wingId: wingId || null,
      createdBy: user.userId,
    });

    res.status(201).json({
      message: "Contact created successfully",
      contact,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Contact already exists with this phone",
      });
    }

    console.error("Create Contact Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// ✅ GET CONTACTS (WITH SEARCH + FILTER)
export const getContacts = async (req, res) => {
  try {
    const user = req.user;

    const { search, category } = req.query;

    let query = {
      isActive: true,
      $or: [
        { societyId: user.societyId, wingId: null },
        { wingId: user.wingId },
      ],
    };

    // 🔍 Category Filter
    if (category) {
      query.category = category;
    }

    let mongoQuery = Contact.find(query);

    // 🔍 TEXT SEARCH
    if (search) {
      mongoQuery = mongoQuery.find({
        $text: { $search: search },
      });
    }

    const contacts = await mongoQuery
      .sort({ category: 1, createdAt: -1 })
      .lean();

    res.status(200).json({ contacts });

  } catch (error) {
    console.error("Get Contacts Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// ✅ UPDATE CONTACT
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // 🔐 SECURITY CHECK
    if (
      contact.societyId.toString() !== req.user.societyId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(contact, req.body);

    await contact.save();

    res.status(200).json({
      message: "Contact updated successfully",
      contact,
    });

  } catch (error) {
    console.error("Update Contact Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// ✅ DELETE CONTACT (SOFT DELETE)
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // 🔐 SECURITY CHECK
    if (
      contact.societyId.toString() !== req.user.societyId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    contact.isActive = false;
    await contact.save();

    res.status(200).json({
      message: "Contact deleted successfully",
    });

  } catch (error) {
    console.error("Delete Contact Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};