import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import Groups2Icon from '@mui/icons-material/Groups2';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const JobListingsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null,
  });

  // Sample job data
  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      location: 'Makati, Metro Manila',
      type: 'Full-time',
      salary: '₱80,000 - ₱120,000',
      posted: '2 days ago',
      logo: 'https://via.placeholder.com/50',
      description: 'We are looking for an experienced Frontend Developer proficient in React...',
      tags: ['React', 'TypeScript', 'Tailwind CSS'],
      vacantleft: '5 Vacancies Left',
      remote: false,
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'Creative Digital Agency',
      location: 'Taguig, Metro Manila',
      type: 'Full-time',
      salary: '₱60,000 - ₱90,000',
      posted: '1 week ago',
      logo: 'https://via.placeholder.com/50',
      description: 'Join our creative team to design user-centric digital experiences...',
      tags: ['Figma', 'Adobe XD', 'UI/UX'],
      vacantleft: '5 Vacancies Left',
      remote: true,
    },
    {
      id: 3,
      title: 'Backend Developer (Node.js)',
      company: 'StartUp Hub',
      location: 'Quezon City, Metro Manila',
      type: 'Contract',
      salary: '₱70,000 - ₱100,000',
      posted: '3 days ago',
      logo: 'https://via.placeholder.com/50',
      description: 'Build scalable backend systems using Node.js and PostgreSQL...',
      tags: ['Node.js', 'PostgreSQL', 'AWS'],
      vacantleft: '5 Vacancies Left',
      remote: true,
    },
    {
      id: 4,
      title: 'Full Stack Developer',
      company: 'Innovation Labs',
      location: 'BGC, Taguig',
      type: 'Full-time',
      salary: '₱90,000 - ₱140,000',
      posted: '5 days ago',
      logo: 'https://via.placeholder.com/50',
      description: 'Looking for a versatile developer comfortable with both frontend and backend...',
      tags: ['React', 'Node.js', 'MongoDB'],
      vacantleft: '5 Vacancies Left',
      remote: false,
    },
    {
      id: 5,
      title: 'Mobile App Developer',
      company: 'AppWorks Studio',
      location: 'Pasig, Metro Manila',
      type: 'Part-time',
      salary: '₱50,000 - ₱80,000',
      posted: '1 day ago',
      logo: 'https://via.placeholder.com/50',
      description: 'Develop cross-platform mobile applications using React Native...',
      tags: ['React Native', 'iOS', 'Android'],
      vacantleft: '5 Vacancies Left',
      remote: true,
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'Cloud Systems Co.',
      location: 'Makati, Metro Manila',
      type: 'Full-time',
      salary: '₱100,000 - ₱150,000',
      posted: '4 days ago',
      logo: 'https://via.placeholder.com/50',
      description: 'Manage cloud infrastructure and CI/CD pipelines...',
      tags: ['AWS', 'Docker', 'Kubernetes'],
      vacantleft: '5 Vacancies Left',
      remote: false,
    },
  ];

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  const handleDetailsClick = (job) => {
    setSelectedJob(job);
    setDetailsModalOpen(true);
  };

  const handleCloseApplyModal = () => {
    setApplyModalOpen(false);
    setApplicationData({
      fullName: '',
      email: '',
      phone: '',
      coverLetter: '',
      resume: null,
    });
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
  };

  const handleApplicationSubmit = () => {
    console.log('Application submitted:', applicationData);
    alert('Application submitted successfully!');
    handleCloseApplyModal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setApplicationData(prev => ({ ...prev, resume: file }));
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = location === '' || job.location.toLowerCase().includes(location.toLowerCase());
    const matchesType = jobType === 'all' || job.type === jobType;
    const matchesTab = tabValue === 0 || (tabValue === 1 && savedJobs.includes(job.id));
    
    return matchesSearch && matchesLocation && matchesType && matchesTab;
  });

  const JobCard = ({ job }) => (
    <Card className="mb-4 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#BAE8E8] to-[#FBDA23] rounded-lg flex items-center justify-center flex-shrink-0">
              <BusinessIcon sx={{ color: '#272343', fontSize: 30 }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#272343] mb-1">{job.title}</h3>
              <p className="text-gray-600 font-medium mb-2">{job.company}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {job.tags.map(tag => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    size="small"
                    sx={{
                      backgroundColor: '#BAE8E8',
                      color: '#272343',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <IconButton 
            onClick={() => toggleSaveJob(job.id)}
            sx={{ color: savedJobs.includes(job.id) ? '#FBDA23' : '#272343' }}
          >
            {savedJobs.includes(job.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </div>

        <p className="text-gray-700 mb-4">{job.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <LocationOnIcon fontSize="small" sx={{ color: '#FBDA23' }} />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <WorkIcon fontSize="small" sx={{ color: '#FBDA23' }} />
            <span className="text-sm">{job.type}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <AttachMoneyIcon fontSize="small" sx={{ color: '#FBDA23' }} />
            <span className="text-sm">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <AccessTimeIcon fontSize="small" sx={{ color: '#FBDA23' }} />
            <span className="text-sm">{job.posted}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Groups2Icon fontSize="small" sx={{ color: '#FBDA23' }} />
            <span className="text-sm">{job.vacantleft}</span>
          </div>
        </div>

        <div className="flex gap-2 items-center">   
          <Button
            variant="contained"
            onClick={() => handleApplyClick(job)}
            sx={{
              backgroundColor: '#FBDA23',
              color: '#272343',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#FFE55C',
              },
            }}
          >
            Apply Now
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleDetailsClick(job)}
            sx={{
              borderColor: '#272343',
              color: '#272343',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#272343',
                backgroundColor: 'rgba(39, 35, 67, 0.05)',
              },
            }}
          >
            View Details
          </Button>
          {job.remote && (
            <Chip 
              label="Remote Available" 
              size="small"
              sx={{
                backgroundColor: '#2ECC71',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-4xl font-bold md:pl-10 pt-15 md:pt-5 text-[#272343] mb-2">Find Your Next Opportunity</h1>
        <p className="text-gray-600 md:pl-10">Discover jobs that match your skills and interests</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 shadow-lg border border-gray-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <TextField
              fullWidth
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#FBDA23' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ color: '#FBDA23' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              fullWidth
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              label="Job Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
            </TextField>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
            </p>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setLocation('');
                setJobType('all');
              }}
              sx={{
                borderColor: '#272343',
                color: '#272343',
                '&:hover': {
                  borderColor: '#272343',
                },
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: '#272343',
              fontWeight: 'bold',
            },
            '& .Mui-selected': {
              color: '#FBDA23',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FBDA23',
            },
          }}
        >
          <Tab label="All Jobs" />
          <Tab label={`Saved Jobs (${savedJobs.length})`} />
        </Tabs>
      </Box>

      {/* Job Listings */}
      <div>
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => <JobCard key={job.id} job={job} />)
        ) : (
          <Card className="p-12 text-center">
            <WorkIcon sx={{ fontSize: 60, color: '#BAE8E8', mb: 2 }} />
            <h3 className="text-xl font-bold text-[#272343] mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>

      {/* Apply Modal */}
      <Dialog 
        open={applyModalOpen} 
        onClose={handleCloseApplyModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#BAE8E8', color: '#272343', fontWeight: 'bold' }}>
          <div className="flex justify-between items-center">
            <span>Apply for {selectedJob?.title}</span>
            <IconButton onClick={handleCloseApplyModal}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {selectedJob?.company} • {selectedJob?.location}
          </Typography>
          
          <TextField
            fullWidth
            label="Full Name"
            value={applicationData.fullName}
            onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
            sx={{ mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={applicationData.email}
            onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
            sx={{ mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Phone Number"
            value={applicationData.phone}
            onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
            sx={{ mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Cover Letter"
            multiline
            rows={4}
            value={applicationData.coverLetter}
            onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
            placeholder="Tell us why you're a great fit for this role..."
            sx={{ mb: 2 }}
          />
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-2">
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="resume-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadFileIcon />}
                sx={{
                  borderColor: '#272343',
                  color: '#272343',
                  '&:hover': {
                    borderColor: '#FBDA23',
                    backgroundColor: '#FBDA23',
                  },
                }}
              >
                Upload Resume
              </Button>
            </label>
            {applicationData.resume && (
              <Typography variant="body2" sx={{ mt: 2, color: '#2ECC71', fontWeight: 'bold' }}>
                ✓ {applicationData.resume.name}
              </Typography>
            )}
            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
              Supported formats: PDF, DOC, DOCX (Max 5MB)
            </Typography>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseApplyModal}
            sx={{
              color: '#272343',
              fontWeight: 'bold',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplicationSubmit}
            variant="contained"
            disabled={!applicationData.fullName || !applicationData.email || !applicationData.phone}
            sx={{
              backgroundColor: '#FBDA23',
              color: '#272343',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#FFE55C',
              },
            }}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>

      {/* Job Details Modal */}
      <Dialog 
        open={detailsModalOpen} 
        onClose={handleCloseDetailsModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#BAE8E8', color: '#272343', fontWeight: 'bold' }}>
          <div className="flex justify-between items-center">
            <span>Job Details</span>
            <IconButton onClick={handleCloseDetailsModal}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedJob && (
            <>
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#BAE8E8] to-[#FBDA23] rounded-lg flex items-center justify-center flex-shrink-0">
                  <BusinessIcon sx={{ color: '#272343', fontSize: 35 }} />
                </div>
                <div>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#272343', mb: 1 }}>
                    {selectedJob.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    {selectedJob.company}
                  </Typography>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedJob.tags.map(tag => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    sx={{
                      backgroundColor: '#BAE8E8',
                      color: '#272343',
                      fontWeight: 'bold',
                    }}
                  />
                ))}
              </div>

              <Divider sx={{ my: 3 }} />

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <LocationOnIcon sx={{ color: '#FBDA23' }} />
                  <div>
                    <Typography variant="caption" color="text.secondary">Location</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedJob.location}</Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <WorkIcon sx={{ color: '#FBDA23' }} />
                  <div>
                    <Typography variant="caption" color="text.secondary">Job Type</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedJob.type}</Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AttachMoneyIcon sx={{ color: '#FBDA23' }} />
                  <div>
                    <Typography variant="caption" color="text.secondary">Salary Range</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedJob.salary}</Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AccessTimeIcon sx={{ color: '#FBDA23' }} />
                  <div>
                    <Typography variant="caption" color="text.secondary">Posted</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedJob.posted}</Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Groups2Icon sx={{ color: '#FBDA23' }} />
                  <div>
                    <Typography variant="caption" color="text.secondary">Vacancies</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedJob.vacantleft}</Typography>
                  </div>
                </div>
                {selectedJob.remote && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#2ECC71] rounded-full" />
                    <div>
                      <Typography variant="caption" color="text.secondary">Work Setup</Typography>
                      <Typography variant="body2" fontWeight="bold" color="#2ECC71">Remote Available</Typography>
                    </div>
                  </div>
                )}
              </div>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#272343', mb: 2 }}>
                Job Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                {selectedJob.description}
              </Typography>

              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                We are seeking a talented professional to join our dynamic team. The ideal candidate will have:
              </Typography>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Strong experience in relevant technologies</li>
                <li>Excellent problem-solving and communication skills</li>
                <li>Ability to work collaboratively in a team environment</li>
                <li>Passion for continuous learning and professional development</li>
              </ul>

              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#272343', mb: 2 }}>
                Benefits
              </Typography>
              <ul className="list-disc list-inside space-y-1">
                <li>Competitive salary package</li>
                <li>Health insurance coverage</li>
                <li>Professional development opportunities</li>
                <li>Flexible work arrangements</li>
                <li>Collaborative team culture</li>
              </ul>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              handleCloseDetailsModal();
              toggleSaveJob(selectedJob.id);
            }}
            startIcon={savedJobs.includes(selectedJob?.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            sx={{
              color: '#272343',
              fontWeight: 'bold',
            }}
          >
            {savedJobs.includes(selectedJob?.id) ? 'Saved' : 'Save Job'}
          </Button>
          <Button
            onClick={() => {
              handleCloseDetailsModal();
              handleApplyClick(selectedJob);
            }}
            variant="contained"
            sx={{
              backgroundColor: '#FBDA23',
              color: '#272343',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#FFE55C',
              },
            }}
          >
            Apply Now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobListingsSection;