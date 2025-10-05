import React, { useState } from "react";

const SkillsSection = () => {
  const [skills, setSkills] = useState(["Figma", "Adobe", "Frontend"]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="mt-6 w-full">
      <h3 className="font-bold italic">Skills</h3>

      {/* Skills List */}
      <div className="flex flex-wrap gap-2 mt-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-white rounded shadow text-sm flex items-center gap-2"
          >
            {skill}
            <button
              onClick={() => handleRemoveSkill(skill)}
              className="text-red-500 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Add New Skill */}
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Enter skill"
          className="border px-2 py-1 text-sm flex-1 rounded"
        />
        <button
          onClick={handleAddSkill}
          className="px-3 py-1 bg-white rounded shadow text-sm font-bold whitespace-nowrap"
        >
          + Add
        </button>
      </div>
    </div>
  );
};

export default SkillsSection;
