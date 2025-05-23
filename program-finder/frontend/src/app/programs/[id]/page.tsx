'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProgramData } from '../../../interfaces/ProgramData';
import BookmarkButton from '../../../components/BookmarkButton';
import { GoogleMap } from '../../../components/GoogleMap';
import PageLayout from '../../../components/PageLayout';
import './page.css';

export default function ProgramDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [program, setProgram] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    // Log environment variable status for debugging
    console.log('Environment Variables Check:');
    console.log('NEXT_PUBLIC_GOOGLE_API_KEY exists:', !!process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
    console.log('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY exists:', !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    
    setLoading(true);
    fetch(`/api/programs/${id}`)
      .then(r => r.json())
      .then(data => {
        console.log('Program data:', data); // Log to see what we're getting
        setProgram(data);
      })
      .catch(() => setProgram(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Determine which image to use based on category or default to generic
  const getImageForProgram = (program: ProgramData) => {
    if (program.type?.toLowerCase().includes('education')) return '/images/education.png';
    if (program.type?.toLowerCase().includes('sports')) return '/images/sports.png';
    if (program.type?.toLowerCase().includes('art')) return '/images/arts.png';
    return '/images/SDefault.png'; // Default image
  };

  const handleBackClick = () => {
    router.push('/programs');
  };

  if (loading) return (
    <PageLayout>
      <section id="main" className="container">
        <div className="box">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading program details...</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
  
  if (!program) return (
    <PageLayout>
      <section id="main" className="container">
        <div className="box">
          <h3>Program not found</h3>
          <p>The program you're looking for could not be found.</p>
          <ul className="actions">
            <li><button onClick={handleBackClick} className="button">Back to Programs</button></li>
          </ul>
        </div>
      </section>
    </PageLayout>
  );

  // Build a complete address - prioritize location field if available
  let displayAddress = '';
  if (program.location) {
    displayAddress = program.location;
  } else {
    // Fall back to constructed address
    displayAddress = [
      program.address,
      program.city,
      program.state,
      program.zip_code
    ].filter(Boolean).join(', ');
  }

  // For Google Maps, use the most complete address information available
  const mapAddress = displayAddress || program.zip_code;
  const hasAddress = !!displayAddress;

  return (
    <PageLayout>
      <section id="main" className="container">
        <header>
          <h2>{program.organization}</h2>
          <p>Program Details</p>
        </header>
        
        <div className="box">
          <span className="image featured">
            <img src={getImageForProgram(program)} alt={program.organization} />
          </span>
          
          <div className="program-header">
            <h3>{program.organization}</h3>
            <BookmarkButton programId={program.id} />
          </div>
          
          <div className="row">
            <div className="col-6 col-12-mobilep">
              <h4>Program Information</h4>
              <ul className="alt">
                <li><strong>Services:</strong> {program.services}</li>
                <li><strong>Type:</strong> {program.type}</li>
                <li><strong>Ages:</strong> {program.ages}</li>
                {hasAddress && (
                  <li className="location-item">
                    <strong>Location:</strong>
                    <div 
                      className="clickable-address" 
                      onClick={() => setShowMap(!showMap)}
                      style={{
                        cursor: 'pointer',
                        color: '#3498db',
                        textDecoration: 'underline',
                        display: 'inline-block'
                      }}
                    >
                      {displayAddress}
                      <span className="location-pin" style={{ 
                        marginLeft: '5px', 
                        fontSize: '1em',
                        color: showMap ? '#e74c3c' : '#3498db'
                      }}>
                        <svg 
                          viewBox="0 0 384 512" 
                          height="16" 
                          width="16" 
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                        >
                          <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
                        </svg>
                        {showMap ? " Hide map" : " Show map"}
                      </span>
                    </div>
                  </li>
                )}
              </ul>
              {showMap && hasAddress && (
                <div className="map-container" style={{ marginTop: '15px', borderRadius: '8px', overflow: 'hidden' }}>
                  <GoogleMap address={mapAddress} height="300px" />
                </div>
              )}
            </div>
            <div className="col-6 col-12-mobilep">
              <h4>Contact Information</h4>
              {program.contact_phone && <p><strong>Phone:</strong> {program.contact_phone}</p>}
              {program.contact_email && <p><strong>Email:</strong> {program.contact_email}</p>}
              {program.contact_website && (
                <p>
                  <strong>Website:</strong>{' '}
                  <a href={program.contact_website} target="_blank" rel="noopener noreferrer">
                    {program.contact_website}
                  </a>
                </p>
              )}
              <ul className="actions">
                <li><button onClick={handleBackClick} className="button alt">Back to Programs</button></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
} 