import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useSessionCheck } from "../useSessionCheck";
import SessionExpiredModal from "../SessionExpiredModal";

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


  const { userData, loading, sessionError } = useSessionCheck();



  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
    },
    objective: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    references: "Available upon request",
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

  const validateURL = (url) => {
    if (!url || url.toLowerCase() === 'skip' || url.toLowerCase() === 'none') return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
          botResponse = "Great! 🌐 Do you have a LinkedIn profile? (Paste the URL or type 'skip')";
          setCurrentStep("linkedin");
        }
        break;

      case "linkedin":
        if (userInput.toLowerCase() === 'skip' || userInput.toLowerCase() === 'none') {
          updatedData.personalInfo.linkedin = "";
          botResponse = "No problem! Do you have a portfolio website or GitHub profile? (Paste URL or type 'skip')";
          setCurrentStep("portfolio");
        } else if (!validateURL(userInput)) {
          botResponse = "Please enter a valid URL (e.g., https://linkedin.com/in/yourname) or type 'skip'";
          isValid = false;
        } else {
          updatedData.personalInfo.linkedin = userInput;
          botResponse = "Excellent! Do you have a portfolio website or GitHub profile? (Paste URL or type 'skip')";
          setCurrentStep("portfolio");
        }
        break;

      case "portfolio":
        if (userInput.toLowerCase() === 'skip' || userInput.toLowerCase() === 'none') {
          updatedData.personalInfo.portfolio = "";
          botResponse = "Understood! Now, what type of position are you applying for? Write a brief career objective (1-2 sentences).\n\nExample: Seeking a Marketing Coordinator position where I can leverage my digital marketing skills to drive brand growth.";
          setCurrentStep("objective");
        } else if (!validateURL(userInput)) {
          botResponse = "Please enter a valid URL (e.g., https://yourportfolio.com) or type 'skip'";
          isValid = false;
        } else {
          updatedData.personalInfo.portfolio = userInput;
          botResponse = "Perfect! 🎯 Now, what type of position are you applying for? Write a brief career objective (1-2 sentences).\n\nExample: Seeking a Marketing Coordinator position where I can leverage my digital marketing skills to drive brand growth.";
          setCurrentStep("objective");
        }
        break;

      case "objective":
        if (userInput.split(" ").length < 8) {
          botResponse = "Please provide more details about your career objective (at least 8 words).";
          isValid = false;
        } else {
          setMessages((prev) => [...prev, { from: "bot", text: "✨ Refining your career objective with AI..." }]);
          
          const enhancedObjective = await callGeminiAPI(
            userInput, 
            "Rewrite this career objective to be compelling and professional. Make it concise (1-2 sentences), action-oriented, and tailored for Philippine job applications. Return only the refined objective without explanations."
          );
          
          updatedData.objective = enhancedObjective || userInput;
          botResponse = enhancedObjective 
            ? `Great! Here's your refined objective:\n\n"${enhancedObjective}"\n\n💼 Now tell me about yourself professionally. Write 2-3 sentences highlighting your experience, key strengths, and what makes you stand out.`
            : "Great! 💼 Now tell me about yourself professionally. Write 2-3 sentences highlighting your experience, key strengths, and what makes you stand out.";
          setCurrentStep("summary");
        }
        break;

      case "summary":
        if (userInput.split(" ").length < 10) {
          botResponse = "Please provide more details (at least 10 words). Describe your professional background, key achievements, and strengths.";
          isValid = false;
        } else {
          setMessages((prev) => [...prev, { from: "bot", text: "✨ Enhancing your summary with AI..." }]);
          
          const enhancedSummary = await callGeminiAPI(
            userInput, 
            "Improve and rewrite this professional summary for a resume tailored to job applications in the Philippines. Make it sound confident, achievement-focused, and professional. Include specific strengths and value propositions. Keep it concise (3–4 sentences) and return only one final version without giving multiple options or explanations."
          );
          
          updatedData.summary = enhancedSummary || userInput;
          botResponse = enhancedSummary 
            ? `Excellent! Here's your enhanced summary:\n\n"${enhancedSummary}"\n\n👔 Let's add your work experience. Tell me about your most recent job:\n\nFormat: Job Title | Company Name | Start Date - End Date\nExample: Marketing Assistant | SM Supermalls | Jan 2022 - Present`
            : "Excellent! 👔 Let's add your work experience. Tell me about your most recent job:\n\nFormat: Job Title | Company Name | Start Date - End Date\nExample: Marketing Assistant | SM Supermalls | Jan 2022 - Present";
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
          botResponse = "Great! Now describe your key responsibilities and achievements in this role (separate each with a semicolon).\n\nExample: Handled customer inquiries and complaints; Increased sales by 20% through upselling techniques; Trained 5 new employees on company procedures";
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
          botResponse = "Great! 🎓 Do you have any professional certifications? (e.g., TESDA, NC II, First Aid, etc.)\n\nFormat: Certification Name | Issuing Organization | Year\nExample: National Certificate II in Housekeeping | TESDA | 2023\n\nOr type 'skip' if none";
          setCurrentStep("certifications");
        }
        break;

      case "certifications":
        if (userInput.toLowerCase() === 'skip' || userInput.toLowerCase() === 'none') {
          updatedData.certifications = [];
          botResponse = "No problem! 🌍 What languages can you speak? (Include proficiency level)\n\nFormat: Language - Proficiency\nExample: English - Fluent, Tagalog - Native, Bisaya - Conversational\n\nSeparate multiple languages with commas.";
          setCurrentStep("languages");
        } else {
          const certParts = userInput.split("|").map((s) => s.trim());
          if (certParts.length < 2) {
            botResponse = "Please follow the format: Certification Name | Issuing Organization | Year\nOr type 'skip' if you don't have any certifications";
            isValid = false;
          } else {
            updatedData.certifications.push({
              name: certParts[0],
              issuer: certParts[1],
              year: certParts[2] || "N/A",
            });
            botResponse = "Excellent! Do you want to add another certification? Type 'yes' or 'no'";
            setCurrentStep("certifications_more");
          }
        }
        break;

      case "certifications_more":
        if (userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("oo")) {
          botResponse = "Enter your next certification:\n\nFormat: Certification Name | Issuing Organization | Year";
          setCurrentStep("certifications");
        } else {
          botResponse = "Perfect! 🌍 What languages can you speak? (Include proficiency level)\n\nFormat: Language - Proficiency\nExample: English - Fluent, Tagalog - Native, Bisaya - Conversational\n\nSeparate multiple languages with commas.";
          setCurrentStep("languages");
        }
        break;

      case "languages":
        const languagesList = userInput.split(",").map((s) => s.trim()).filter((s) => s);
        if (languagesList.length < 1) {
          botResponse = "Please list at least one language with proficiency level.\nExample: English - Fluent, Tagalog - Native";
          isValid = false;
        } else {
          updatedData.languages = languagesList;
          botResponse = "Almost done! 🎉 List your key skills separated by commas (at least 3 skills).\n\nExample: Customer Service, MS Office, Social Media Marketing, Time Management, Communication Skills";
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
          botResponse = "Sure! What section would you like to edit? (personal info, objective, summary, experience, education, certifications, languages, or skills)";
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
  let contactInfo = `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}`;
  doc.text(contactInfo, 105, 28, { align: 'center' });
  
  if (resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio) {
    let links = [];
    if (resumeData.personalInfo.linkedin) links.push(resumeData.personalInfo.linkedin);
    if (resumeData.personalInfo.portfolio) links.push(resumeData.personalInfo.portfolio);
    doc.setFontSize(8);
    doc.text(links.join(' | '), 105, 36, { align: 'center' });
  }
  
  y = 55;

  if (resumeData.objective) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('CAREER OBJECTIVE', 20, y);
    
    doc.setFillColor(...accentColor);
    doc.rect(20, y + 2, 170, 0.5, 'F');
    
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60, 60, 60);
    const objectiveLines = doc.splitTextToSize(resumeData.objective, 170);
    doc.text(objectiveLines, 20, y);
    y += objectiveLines.length * 5 + 8;
  }

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

  if (resumeData.certifications.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    y += 3;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('CERTIFICATIONS', 20, y);
    
    doc.setFillColor(...accentColor);
    doc.rect(20, y + 2, 170, 0.5, 'F');
    
    y += 8;
    
    resumeData.certifications.forEach((cert) => {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...primaryColor);
      doc.text(cert.name, 20, y);
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`${cert.issuer} | ${cert.year}`, 20, y + 5);
      
      y += 11;
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
    y += skillsLines.length * 5 + 8;
  }

  if (resumeData.languages.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    y += 3;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('LANGUAGES', 20, y);
    
    doc.setFillColor(...accentColor);
    doc.rect(20, y + 2, 170, 0.5, 'F');
    
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60, 60, 60);
    
    resumeData.languages.forEach((lang) => {
      doc.text(`• ${lang}`, 20, y);
      y += 5;
    });
  }

  // Return the PDF as blob instead of directly saving
  return doc.output('blob');
};

  const handleDownload = async () => {
    try {
      if (typeof window.jspdf === 'undefined') {
        setError("PDF library is still loading. Please wait a moment and try again.");
        return;
      }

      // Generate PDF and get blob
      const pdfBlob = generatePDF();
      const filename = resumeData.personalInfo.name 
        ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';

      // Download the file to user's computer
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Save to database
      await saveResumeToDatabase(pdfBlob, filename);

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

  const saveResumeToDatabase = async (pdfBlob, filename) => {
    try {
      if (!userData) {
          throw new Error("User data not loaded. Please ensure you're logged in.");
      }
      
      // Fetch user_id from backend using email (same pattern as ProfileSection)
      const userResponse = await fetch(`http://localhost:5000/api/profile/${userData.email}`);
      const userProfile = await userResponse.json();
      
      if (!userProfile || !userProfile.user_id) {
        throw new Error("Could not retrieve user ID from profile.");
      }
      
      const formData = new FormData();
      formData.append('resume', pdfBlob, filename);
      formData.append('userId', userProfile.user_id);
      formData.append('resumeData', JSON.stringify(resumeData));
      const response = await fetch('http://localhost:5000/api/resume/save', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        console.log('Resume saved to database:', data);
        setMessages((prev) => [...prev, { 
          from: "bot", 
          text: "✅ Your resume has been saved to your account!" 
        }]);
        return data;
      } else {
        throw new Error(data.error || 'Failed to save resume');
      }
    } catch (error) {
      console.error('Error saving resume to database:', error);
      setError(`Failed to save resume: ${error.message}. Please log in and try again.`);
      return null;
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
            // Add this code right after the line:
// <button onClick={() => setShowPreview(true)}

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
      {/* Header */}
      <div className="mb-6 pb-4 border-b-4 border-yellow-400">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {data.personalInfo.name || "Your Name"}
        </h1>
        <div className="text-sm text-gray-600 flex flex-wrap gap-3">
          <span>📧 {data.personalInfo.email}</span>
          <span>📞 {data.personalInfo.phone}</span>
          <span>📍 {data.personalInfo.location}</span>
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.portfolio) && (
          <div className="text-xs text-blue-600 mt-2 flex flex-wrap gap-2">
            {data.personalInfo.linkedin && <span>🔗 {data.personalInfo.linkedin}</span>}
            {data.personalInfo.portfolio && <span>🌐 {data.personalInfo.portfolio}</span>}
          </div>
        )}
      </div>

      {/* Career Objective */}
      {data.objective && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 pb-1 border-b-2 border-yellow-400">
            CAREER OBJECTIVE
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">{data.objective}</p>
        </div>
      )}

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 pb-1 border-b-2 border-yellow-400">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">{data.summary}</p>
        </div>
      )}

      {/* Work Experience */}
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

      {/* Education */}
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

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 border-yellow-400">
            CERTIFICATIONS
          </h2>
          {data.certifications.map((cert, idx) => (
            <div key={idx} className="mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
              <p className="text-xs text-gray-600">{cert.issuer} | {cert.year}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
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

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 border-yellow-400">
            LANGUAGES
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang, idx) => (
              <span key={idx} className="text-sm text-gray-700">• {lang}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerBotSection;