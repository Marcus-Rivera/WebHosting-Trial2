import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const CareerBotSection = () => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Kumusta! 👋 Welcome to TaraTrabaho AI Resume Builder! I'll help you create a professional resume tailored for Philippine employers. Let's start with your full name.",
    },
  ]);
  const [input, setInput] = useState("");
  const [currentStep, setCurrentStep] = useState("name");
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);


  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    script.onload = () => {
      console.log('jsPDF loaded successfully');
    };
    script.onerror = () => {
      setError('Failed to load PDF library. Please refresh the page.');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, messages]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+63|0)?9\d{9}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ""));
  };

  const validateName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s.]+$/.test(name);
  };

  const callGeminiAPI = async (userInput, instruction = "") => {
    try {
      const prompt = instruction
        ? `${instruction}\n\nUser input: ${userInput}`
        : userInput;

      const res = await fetch("http://localhost:5000/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data && data.output) {
        return data.output;
      } else if (data && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        // Handles Gemini’s typical response structure
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error("Invalid API response format:", data);
        return null;
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      return null;
    }
  };



  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;
    
    setError("");
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    
    const userInput = input.trim();
    setInput("");
    setIsLoading(true);

    setTimeout(async () => {
      await processUserInput(userInput);
      setIsLoading(false);
    }, 500);
  };

  const processUserInput = async (userInput) => {
    let botResponse = "";
    let isValid = true;
    const updatedData = { ...resumeData };

    switch (currentStep) {
      case "name":
        if (!validateName(userInput)) {
          botResponse = "Please enter a valid name (at least 2 characters, letters only). What's your full name?";
          isValid = false;
        } else {
          updatedData.personalInfo.name = userInput;
          botResponse = `Nice to meet you, ${userInput}! 😊 What's your email address?`;
          setCurrentStep("email");
        }
        break;

      case "email":
        if (!validateEmail(userInput)) {
          botResponse = "That doesn't look like a valid email. Please enter a valid email address (e.g., juan@gmail.com)";
          isValid = false;
        } else {
          updatedData.personalInfo.email = userInput;
          botResponse = "Perfect! What's your mobile number? (Format: 09XX-XXX-XXXX)";
          setCurrentStep("phone");
        }
        break;

      case "phone":
        if (!validatePhone(userInput)) {
          botResponse = "Please enter a valid Philippine mobile number (e.g., 0917-123-4567 or +639171234567)";
          isValid = false;
        } else {
          updatedData.personalInfo.phone = userInput;
          botResponse = "Salamat! Where are you located? (City, Province - e.g., Quezon City, Metro Manila)";
          setCurrentStep("location");
        }
        break;

      case "location":
        if (userInput.length < 3) {
          botResponse = "Please enter your complete location (City and Province/Region)";
          isValid = false;
        } else {
          updatedData.personalInfo.location = userInput;
          botResponse = "Great! Now, tell me about yourself professionally. Write 2-3 sentences about your experience, skills, and career goals.";
          setCurrentStep("summary");
        }
        break;

      case "summary":
        if (userInput.split(" ").length < 10) {
          botResponse = "Please provide more details (at least 10 words). Describe your professional background and what you're looking for.";
          isValid = false;
        } else {
          setMessages((prev) => [...prev, { from: "bot", text: "✨ Enhancing your summary with AI..." }]);
          
          const enhancedSummary = await callGeminiAPI(
            userInput, 
            "Improve and rewrite this professional summary for a resume tailored to job applications. Make it sound confident, natural, and achievement-driven while maintaining a professional tone. Keep the summary concise (3–4 sentences) and return only one final version without giving multiple options or explanations."
          );
          
          updatedData.summary = enhancedSummary || userInput;
          botResponse = enhancedSummary 
            ? `Excellent! Here's your enhanced summary:\n\n"${enhancedSummary}"\n\n👏 Let's add your work experience. Tell me about your most recent job:\n\nFormat: Job Title | Company Name | Start Date - End Date\nExample: Marketing Assistant | SM Supermalls | Jan 2022 - Present`
            : "Excellent! 👏 Let's add your work experience. Tell me about your most recent job:\n\nFormat: Job Title | Company Name | Start Date - End Date\nExample: Marketing Assistant | SM Supermalls | Jan 2022 - Present";
          setCurrentStep("experience");
        }
        break;

      case "experience":
        const expParts = userInput.split("|").map((s) => s.trim());
        if (expParts.length < 3) {
          botResponse = "Please follow the format: Job Title | Company Name | Duration\nExample: Sales Associate | Jollibee | Jan 2022 - Dec 2023";
          isValid = false;
        } else {
          updatedData.currentExperience = {
            title: expParts[0],
            company: expParts[1],
            duration: expParts[2],
            duties: [],
          };
          botResponse = "Great! Now describe your key responsibilities and achievements in this role (separate each with a semicolon).\n\nExample: Handled customer inquiries; Increased sales by 20%; Trained new employees";
          setCurrentStep("experience_duties");
        }
        break;

      case "experience_duties":
        if (userInput.length < 10) {
          botResponse = "Please provide more details about what you did in this role (at least 10 characters).";
          isValid = false;
        } else {
          if (updatedData.currentExperience) {
            const duties = userInput.split(";").map((d) => d.trim()).filter((d) => d);
            updatedData.currentExperience.duties = duties;
            updatedData.experience.push(updatedData.currentExperience);
            delete updatedData.currentExperience;
          }
          botResponse = "Magaling! Do you want to add another work experience? Type 'yes' or 'no'";
          setCurrentStep("experience_more");
        }
        break;

      case "experience_more":
        if (userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("oo")) {
          botResponse = "Please enter your next job experience:\n\nFormat: Job Title | Company Name | Start Date - End Date";
          setCurrentStep("experience");
        } else {
          botResponse = "Perfect! Now let's add your education. Please provide:\n\nFormat: Degree/Course | School Name | Graduation Year\nExample: BS Business Administration | University of the Philippines | 2022";
          setCurrentStep("education");
        }
        break;

      case "education":
        const eduParts = userInput.split("|").map((s) => s.trim());
        if (eduParts.length < 3) {
          botResponse = "Please follow the format: Degree/Course | School | Year\nExample: BS Nursing | UST | 2020";
          isValid = false;
        } else {
          updatedData.education.push({
            degree: eduParts[0],
            institution: eduParts[1],
            year: eduParts[2],
          });
          botResponse = "Would you like to add another educational background? Type 'yes' or 'no'";
          setCurrentStep("education_more");
        }
        break;

      case "education_more":
        if (userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("oo")) {
          botResponse = "Enter your next educational background:\n\nFormat: Degree/Course | School | Year";
          setCurrentStep("education");
        } else {
          botResponse = "Almost done! 🎉 List your key skills separated by commas (at least 3 skills).\n\nExample: Customer Service, MS Office, English/Tagalog, Leadership";
          setCurrentStep("skills");
        }
        break;

      case "skills":
        const skillsList = userInput.split(",").map((s) => s.trim()).filter((s) => s);
        if (skillsList.length < 3) {
          botResponse = "Please list at least 3 skills separated by commas.";
          isValid = false;
        } else {
          updatedData.skills = skillsList;
          botResponse = "Congratulations! 🎊 Your resume is complete! Click 'Preview Resume' to see it, or 'Download PDF' to save it. You can also type 'edit' if you want to change anything.";
          setCurrentStep("complete");
        }
        break;

      case "complete":
        if (userInput.toLowerCase().includes("edit")) {
          botResponse = "Sure! What section would you like to edit? (personal info, summary, experience, education, or skills)";
        } else {
          botResponse = "You can preview your resume or download it as PDF. Need any changes? Just let me know!";
        }
        break;

      default:
        botResponse = "Let's continue building your resume!";
    }

    if (isValid) {
      setResumeData(updatedData);
    }

    setMessages((prev) => [...prev, { from: "bot", text: botResponse }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generatePDF = () => {
    if (typeof window.jspdf === 'undefined') {
      throw new Error("jsPDF library not loaded");
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const primaryColor = [39, 35, 67];
    const accentColor = [255, 230, 96];
    
    let y = 20;

    doc.setFillColor(...accentColor);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text(resumeData.personalInfo.name, 105, 20, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    const contactInfo = `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}`;
    doc.text(contactInfo, 105, 30, { align: 'center' });
    
    y = 55;

    if (resumeData.summary) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('PROFESSIONAL SUMMARY', 20, y);
      
      doc.setFillColor(...accentColor);
      doc.rect(20, y + 2, 170, 0.5, 'F');
      
      y += 8;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60, 60, 60);
      const summaryLines = doc.splitTextToSize(resumeData.summary, 170);
      doc.text(summaryLines, 20, y);
      y += summaryLines.length * 5 + 8;
    }

    if (resumeData.experience.length > 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('WORK EXPERIENCE', 20, y);
      
      doc.setFillColor(...accentColor);
      doc.rect(20, y + 2, 170, 0.5, 'F');
      
      y += 8;
      
      resumeData.experience.forEach((exp) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...primaryColor);
        doc.text(exp.title, 20, y);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.setTextColor(80, 80, 80);
        doc.text(`${exp.company} | ${exp.duration}`, 20, y + 5);
        
        y += 10;
        doc.setFont(undefined, 'normal');
        doc.setTextColor(60, 60, 60);
        
        exp.duties.forEach((duty) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          const dutyLines = doc.splitTextToSize(`• ${duty}`, 165);
          doc.text(dutyLines, 25, y);
          y += dutyLines.length * 5;
        });
        
        y += 5;
      });
    }

    if (resumeData.education.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      y += 3;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('EDUCATION', 20, y);
      
      doc.setFillColor(...accentColor);
      doc.rect(20, y + 2, 170, 0.5, 'F');
      
      y += 8;
      
      resumeData.education.forEach((edu) => {
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...primaryColor);
        doc.text(edu.degree, 20, y);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(`${edu.institution} | ${edu.year}`, 20, y + 5);
        
        y += 12;
      });
    }

    if (resumeData.skills.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      y += 3;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('SKILLS', 20, y);
      
      doc.setFillColor(...accentColor);
      doc.rect(20, y + 2, 170, 0.5, 'F');
      
      y += 8;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60, 60, 60);
      
      const skillsText = resumeData.skills.join(' • ');
      const skillsLines = doc.splitTextToSize(skillsText, 170);
      doc.text(skillsLines, 20, y);
    }

    const fileName = resumeData.personalInfo.name 
      ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
      : 'Resume.pdf';
    doc.save(fileName);
  };

  const handleDownload = () => {
    try {
      if (typeof window.jspdf === 'undefined') {
        setError("PDF library is still loading. Please wait a moment and try again.");
        return;
      }

      generatePDF();
      setMessages((prev) => [...prev, { 
        from: "bot", 
        text: "Your resume has been downloaded! 🎉 Good luck with your job applications!" 
      }]);
      setError("");
    } catch (err) {
      setError("Failed to generate PDF. Please refresh the page and try again.");
      console.error("PDF Generation Error:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden pt-5 bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-4 ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "bot" && (
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0">
                🤖
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs text-sm whitespace-pre-line ${
                msg.from === "user"
                  ? "bg-yellow-400 text-gray-900 font-semibold"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              🤖
            </div>
            <div className="px-4 py-2 rounded-2xl bg-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mx-6 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          <span className="text-sm text-red-700">{error}</span>
          <button 
            onClick={() => setError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {currentStep === "complete" && (
        <div className="px-6 pb-2 flex gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
          >
            📄 Preview Resume
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-yellow-400 text-gray-900 py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors font-semibold"
          >
            ⬇️ Download PDF
          </button>
        </div>
      )}

      <div className="border-t border-gray-300 p-4 bg-white">
        <div className="flex items-center border border-black rounded-lg px-3 py-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            className="flex-1 outline-none text-sm placeholder-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            disabled={isLoading}
            autoFocus
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ""}
            className="ml-2 w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ➤
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-screen overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b bg-gray-800">
              <h2 className="text-xl font-bold text-white">Resume Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-white hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
                <ResumePreview data={resumeData} />
              </div>
            </div>

            <div className="p-4 border-t flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 bg-yellow-400 text-gray-900 py-3 px-4 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
              >
                ⬇️ Download PDF
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResumePreview = ({ data }) => {
  return (
    <div className="bg-white">
      <div className="mb-6 pb-4 border-b-4 border-yellow-400">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {data.personalInfo.name || "Your Name"}
        </h1>
        <div className="text-sm text-gray-600 flex flex-wrap gap-3">
          <span>📧 {data.personalInfo.email}</span>
          <span>📞 {data.personalInfo.phone}</span>
          <span>📍 {data.personalInfo.location}</span>
        </div>
      </div>

      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 pb-1 border-b-2 border-yellow-400">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">{data.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 border-yellow-400">
            WORK EXPERIENCE
          </h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 text-base">{exp.title}</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{exp.duration}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2 italic">{exp.company}</p>
              {exp.duties && exp.duties.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                  {exp.duties.map((duty, i) => (
                    <li key={i}>{duty}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 border-yellow-400">
            EDUCATION
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 border-yellow-400">
            SKILLS
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerBotSection;