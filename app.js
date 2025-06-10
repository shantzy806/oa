// Application State
let currentStep = 1;
let processedDOIs = [];
let metadataResults = {};
let pdfResults = {};
let fieldMappings = {};

// Sample Data
const sampleData = {
  openAlex: {
    "10.1038/nature12373": {
      "id": "https://openalex.org/W2138270253",
      "doi": "https://doi.org/10.1038/nature12373",
      "title": "DNA sequencing with chain-terminating inhibitors",
      "display_name": "DNA sequencing with chain-terminating inhibitors",
      "publication_year": 2013,
      "publication_date": "2013-07-18",
      "primary_location": {
        "source": {
          "display_name": "Nature",
          "issn_l": "0028-0836",
          "type": "journal"
        }
      },
      "type": "article",
      "authorships": [
        {
          "author": {
            "display_name": "Frederick Sanger",
            "orcid": "https://orcid.org/0000-0002-5926-4714"
          },
          "institutions": [
            {
              "display_name": "University of Cambridge",
              "ror": "https://ror.org/013meh722",
              "country_code": "GB"
            }
          ]
        },
        {
          "author": {
            "display_name": "Steven Nicklen",
            "orcid": null
          },
          "institutions": [
            {
              "display_name": "University of Cambridge",
              "ror": "https://ror.org/013meh722",
              "country_code": "GB"
            }
          ]
        }
      ],
      "topics": [
        {
          "display_name": "DNA Sequencing Technologies",
          "score": 0.9999
        },
        {
          "display_name": "Molecular Biology Methods",
          "score": 0.8543
        }
      ],
      "keywords": ["DNA sequencing", "chain termination", "molecular biology"],
      "abstract": "We describe here a new method for DNA sequencing based on selective chemical cleavage...",
      "cited_by_count": 15420,
      "concepts": [
        {
          "display_name": "DNA sequencing",
          "score": 0.89
        },
        {
          "display_name": "Molecular biology",
          "score": 0.76
        }
      ]
    },
    "10.1093/nar/gkr1047": {
      "id": "https://openalex.org/W2100837269",
      "doi": "https://doi.org/10.1093/nar/gkr1047",
      "title": "BLAST: at the core of a powerful and diverse set of sequence analysis tools",
      "display_name": "BLAST: at the core of a powerful and diverse set of sequence analysis tools",
      "publication_year": 2008,
      "publication_date": "2008-07-01",
      "primary_location": {
        "source": {
          "display_name": "Nucleic Acids Research",
          "issn_l": "0305-1048",
          "type": "journal"
        }
      },
      "type": "article",
      "authorships": [
        {
          "author": {
            "display_name": "Stephen F. Altschul",
            "orcid": "https://orcid.org/0000-0001-8460-8941"
          },
          "institutions": [
            {
              "display_name": "National Center for Biotechnology Information",
              "ror": "https://ror.org/02meqm098",
              "country_code": "US"
            }
          ]
        }
      ],
      "topics": [
        {
          "display_name": "Bioinformatics Tools",
          "score": 0.9876
        },
        {
          "display_name": "Sequence Analysis",
          "score": 0.9234
        }
      ],
      "keywords": ["BLAST", "sequence analysis", "bioinformatics", "database search"],
      "abstract": "The Basic Local Alignment Search Tool (BLAST) finds regions of local similarity between sequences...",
      "cited_by_count": 42137,
      "concepts": [
        {
          "display_name": "BLAST",
          "score": 0.94
        },
        {
          "display_name": "Bioinformatics",
          "score": 0.89
        }
      ]
    }
  },
  unpaywall: {
    "10.1038/nature12373": {
      "doi": "10.1038/nature12373",
      "is_oa": true,
      "best_oa_location": {
        "url_for_pdf": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3892452/pdf/",
        "host_type": "repository",
        "license": "cc-by",
        "version": "publishedVersion"
      },
      "oa_locations": [
        {
          "url_for_pdf": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3892452/pdf/",
          "host_type": "repository",
          "license": "cc-by"
        }
      ]
    },
    "10.1093/nar/gkr1047": {
      "doi": "10.1093/nar/gkr1047",
      "is_oa": true,
      "best_oa_location": {
        "url_for_pdf": "https://academic.oup.com/nar/article-pdf/36/suppl_2/W5/16966896/gkn201.pdf",
        "host_type": "publisher",
        "license": "cc-by-nc",
        "version": "publishedVersion"
      },
      "oa_locations": [
        {
          "url_for_pdf": "https://academic.oup.com/nar/article-pdf/36/suppl_2/W5/16966896/gkn201.pdf",
          "host_type": "publisher",
          "license": "cc-by-nc"
        }
      ]
    }
  },
  collections: [
    {
      "id": "123456789/1",
      "name": "Faculty Publications",
      "handle": "123456789/1"
    },
    {
      "id": "123456789/2",
      "name": "Graduate Student Research",
      "handle": "123456789/2"
    },
    {
      "id": "123456789/3",
      "name": "Conference Papers",
      "handle": "123456789/3"
    }
  ],
  dublinCore: {
    "dc.title": "Title",
    "dc.creator": "Creator/Author",
    "dc.contributor": "Contributor",
    "dc.subject": "Subject/Keywords",
    "dc.description": "Description/Abstract",
    "dc.description.abstract": "Abstract",
    "dc.publisher": "Publisher",
    "dc.contributor.author": "Author",
    "dc.date": "Date",
    "dc.date.issued": "Date Issued",
    "dc.type": "Type",
    "dc.format": "Format",
    "dc.identifier": "Identifier",
    "dc.identifier.doi": "DOI",
    "dc.identifier.uri": "URI",
    "dc.source": "Source",
    "dc.language": "Language",
    "dc.relation": "Relation",
    "dc.coverage": "Coverage",
    "dc.rights": "Rights"
  },
  mappings: {
    "display_name": "dc.title",
    "authorships": "dc.contributor.author",
    "publication_date": "dc.date.issued",
    "primary_location.source.display_name": "dc.source",
    "doi": "dc.identifier.doi",
    "abstract": "dc.description.abstract",
    "keywords": "dc.subject",
    "type": "dc.type",
    "concepts": "dc.subject",
    "topics": "dc.subject"
  }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  populateCollections();
  updateProgress();
}

function setupEventListeners() {
  // DOI Form submission
  document.getElementById('doiForm').addEventListener('submit', handleDOISubmission);
  
  // Navigation buttons
  document.getElementById('prevButton').addEventListener('click', () => navigateStep(-1));
  document.getElementById('nextButton').addEventListener('click', () => navigateStep(1));
  
  // Deposit button
  document.getElementById('depositButton').addEventListener('click', handleDeposit);
}

function addSampleDOI(doi) {
  const textarea = document.getElementById('doiInput');
  const currentValue = textarea.value.trim();
  if (currentValue) {
    textarea.value = currentValue + '\n' + doi;
  } else {
    textarea.value = doi;
  }
}

function validateDOI(doi) {
  const doiRegex = /^10\.\d{4,}\/[^\s]+$/;
  return doiRegex.test(doi.trim());
}

function showValidationMessage(message, type) {
  const messageElement = document.getElementById('validationMessage');
  messageElement.textContent = message;
  messageElement.className = `validation-message ${type}`;
}

async function handleDOISubmission(event) {
  event.preventDefault();
  
  const doiInput = document.getElementById('doiInput').value;
  const dois = doiInput.split('\n').map(doi => doi.trim()).filter(doi => doi);
  
  // Validation
  if (dois.length === 0) {
    showValidationMessage('Please enter at least one DOI.', 'error');
    return;
  }
  
  const invalidDOIs = dois.filter(doi => !validateDOI(doi));
  if (invalidDOIs.length > 0) {
    showValidationMessage(`Invalid DOI format: ${invalidDOIs.join(', ')}`, 'error');
    return;
  }
  
  // Show loading
  const spinner = document.getElementById('loadingSpinner');
  const submitButton = event.target.querySelector('button[type="submit"]');
  spinner.classList.remove('hidden');
  submitButton.disabled = true;
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    processedDOIs = dois;
    await fetchMetadata(dois);
    await checkPDFAvailability(dois);
    
    showValidationMessage(`Successfully processed ${dois.length} DOI(s).`, 'success');
    
    // Move to next step
    setTimeout(() => {
      navigateStep(1);
    }, 1000);
    
  } catch (error) {
    showValidationMessage('Error processing DOIs. Please try again.', 'error');
  } finally {
    spinner.classList.add('hidden');
    submitButton.disabled = false;
  }
}

async function fetchMetadata(dois) {
  metadataResults = {};
  
  for (const doi of dois) {
    // Use sample data or create mock data
    if (sampleData.openAlex[doi]) {
      metadataResults[doi] = sampleData.openAlex[doi];
    } else {
      // Create mock data for unknown DOIs
      metadataResults[doi] = createMockMetadata(doi);
    }
  }
  
  displayMetadata();
}

function createMockMetadata(doi) {
  return {
    id: `https://openalex.org/W${Math.floor(Math.random() * 1000000000)}`,
    doi: `https://doi.org/${doi}`,
    title: `Sample Article Title for ${doi}`,
    display_name: `Sample Article Title for ${doi}`,
    publication_year: 2020,
    publication_date: "2020-01-01",
    primary_location: {
      source: {
        display_name: "Sample Journal",
        issn_l: "1234-5678",
        type: "journal"
      }
    },
    type: "article",
    authorships: [
      {
        author: {
          display_name: "Sample Author",
          orcid: null
        },
        institutions: [
          {
            display_name: "Sample University",
            country_code: "US"
          }
        ]
      }
    ],
    topics: [
      {
        display_name: "Sample Topic",
        score: 0.8
      }
    ],
    keywords: ["sample", "research", "academic"],
    abstract: "This is a sample abstract for demonstration purposes...",
    cited_by_count: Math.floor(Math.random() * 1000),
    concepts: [
      {
        display_name: "Sample Concept",
        score: 0.7
      }
    ]
  };
}

function displayMetadata() {
  const container = document.getElementById('metadataResults');
  container.innerHTML = '';
  
  Object.entries(metadataResults).forEach(([doi, metadata]) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'metadata-item';
    
    itemElement.innerHTML = `
      <div class="metadata-header">
        <h3>${metadata.display_name}</h3>
        <p><strong>DOI:</strong> ${doi}</p>
      </div>
      <div class="metadata-content">
        <div class="metadata-field">
          <div class="field-label">Journal:</div>
          <div class="field-value">${metadata.primary_location?.source?.display_name || 'N/A'}</div>
        </div>
        <div class="metadata-field">
          <div class="field-label">Year:</div>
          <div class="field-value">${metadata.publication_year}</div>
        </div>
        <div class="metadata-field">
          <div class="field-label">Authors:</div>
          <div class="field-value">
            <div class="author-list">
              ${metadata.authorships?.map(authorship => 
                `<span class="author-tag">${authorship.author.display_name}</span>`
              ).join('') || 'N/A'}
            </div>
          </div>
        </div>
        <div class="metadata-field">
          <div class="field-label">Keywords:</div>
          <div class="field-value">
            <div class="keywords-list">
              ${metadata.keywords?.map(keyword => 
                `<span class="keyword-tag">${keyword}</span>`
              ).join('') || 'N/A'}
            </div>
          </div>
        </div>
        <div class="metadata-field">
          <div class="field-label">Citations:</div>
          <div class="field-value">${metadata.cited_by_count || 0}</div>
        </div>
        <div class="metadata-field">
          <div class="field-label">Abstract:</div>
          <div class="field-value">${metadata.abstract || 'No abstract available'}</div>
        </div>
      </div>
    `;
    
    container.appendChild(itemElement);
  });
}

async function checkPDFAvailability(dois) {
  pdfResults = {};
  
  for (const doi of dois) {
    if (sampleData.unpaywall[doi]) {
      pdfResults[doi] = sampleData.unpaywall[doi];
    } else {
      // Create mock PDF availability data
      pdfResults[doi] = {
        doi: doi,
        is_oa: Math.random() > 0.5,
        best_oa_location: Math.random() > 0.5 ? {
          url_for_pdf: `https://example.com/pdf/${doi.replace('/', '_')}.pdf`,
          host_type: "repository",
          license: "cc-by",
          version: "publishedVersion"
        } : null,
        oa_locations: []
      };
    }
  }
  
  displayPDFResults();
}

function displayPDFResults() {
  const container = document.getElementById('pdfResults');
  container.innerHTML = '';
  
  Object.entries(pdfResults).forEach(([doi, pdfData]) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'pdf-item';
    
    const title = metadataResults[doi]?.display_name || doi;
    
    itemElement.innerHTML = `
      <h3>${title}</h3>
      <div class="pdf-status">
        <span class="${pdfData.is_oa ? 'pdf-available' : 'pdf-unavailable'}">
          ${pdfData.is_oa ? '✓ Open Access PDF Available' : '✗ No Open Access PDF Found'}
        </span>
      </div>
      ${pdfData.is_oa && pdfData.best_oa_location ? `
        <div class="pdf-links">
          <a href="${pdfData.best_oa_location.url_for_pdf}" target="_blank" class="pdf-link">
            <span>📄 Download PDF</span>
            <span class="license-tag">${pdfData.best_oa_location.license}</span>
          </a>
        </div>
      ` : ''}
    `;
    
    container.appendChild(itemElement);
  });
}

function populateCollections() {
  const select = document.getElementById('collectionSelect');
  sampleData.collections.forEach(collection => {
    const option = document.createElement('option');
    option.value = collection.id;
    option.textContent = collection.name;
    select.appendChild(option);
  });
}

function navigateStep(direction) {
  const newStep = currentStep + direction;
  
  if (newStep < 1 || newStep > 5) return;
  
  // Hide current step
  document.getElementById(`step${currentStep}`).classList.remove('active');
  document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
  
  // Mark completed steps
  if (direction > 0) {
    document.querySelector(`[data-step="${currentStep}"]`).classList.add('completed');
  } else {
    document.querySelector(`[data-step="${newStep + 1}"]`).classList.remove('completed');
  }
  
  currentStep = newStep;
  
  // Show new step
  document.getElementById(`step${currentStep}`).classList.add('active');
  document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
  
  // Initialize step content
  if (currentStep === 4) {
    setupMappingInterface();
  } else if (currentStep === 5) {
    setupDepositPreview();
  }
  
  updateProgress();
  updateNavigation();
}

function updateProgress() {
  const progressFill = document.getElementById('progressFill');
  const percentage = (currentStep / 5) * 100;
  progressFill.style.width = `${percentage}%`;
}

function updateNavigation() {
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  
  prevButton.disabled = currentStep === 1;
  
  // Enable next button based on step completion
  if (currentStep === 1) {
    nextButton.disabled = processedDOIs.length === 0;
  } else if (currentStep === 4) {
    nextButton.disabled = Object.keys(fieldMappings).length === 0;
  } else {
    nextButton.disabled = false;
  }
  
  // Hide next button on last step
  if (currentStep === 5) {
    nextButton.style.display = 'none';
  } else {
    nextButton.style.display = 'inline-flex';
  }
}

function setupMappingInterface() {
  const container = document.getElementById('mappingFields');
  container.innerHTML = '';
  
  const mappingEntries = Object.entries(sampleData.mappings);
  
  mappingEntries.forEach(([sourceField, defaultTarget]) => {
    const fieldElement = document.createElement('div');
    fieldElement.className = 'mapping-field';
    
    fieldElement.innerHTML = `
      <div class="source-field">${sourceField}</div>
      <select class="form-control mapping-select" data-source="${sourceField}">
        <option value="">Select Dublin Core field...</option>
        ${Object.entries(sampleData.dublinCore).map(([key, label]) => 
          `<option value="${key}" ${key === defaultTarget ? 'selected' : ''}>${key} (${label})</option>`
        ).join('')}
      </select>
    `;
    
    container.appendChild(fieldElement);
  });
  
  // Initialize field mappings
  fieldMappings = { ...sampleData.mappings };
  
  // Add event listeners
  container.querySelectorAll('.mapping-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const sourceField = e.target.dataset.source;
      fieldMappings[sourceField] = e.target.value;
      updateNavigation();
    });
  });
}

function setupDepositPreview() {
  const container = document.getElementById('depositPreview');
  container.innerHTML = '';
  
  processedDOIs.forEach(doi => {
    const metadata = metadataResults[doi];
    const previewElement = document.createElement('div');
    previewElement.className = 'preview-item';
    
    const mappedData = createMappedMetadata(metadata, fieldMappings);
    
    previewElement.innerHTML = `
      <div class="preview-header">
        <h3>${metadata.display_name}</h3>
        <p><strong>DOI:</strong> ${doi}</p>
      </div>
      <div class="preview-content">
        <h4>Mapped Dublin Core Fields:</h4>
        <div class="mapped-fields">
          ${Object.entries(mappedData).map(([dcField, value]) => `
            <div class="dc-field">${dcField}</div>
            <div class="dc-value">${Array.isArray(value) ? value.join('; ') : value}</div>
          `).join('')}
        </div>
      </div>
    `;
    
    container.appendChild(previewElement);
  });
}

function createMappedMetadata(metadata, mappings) {
  const mapped = {};
  
  Object.entries(mappings).forEach(([sourceField, dcField]) => {
    if (!dcField) return;
    
    let value = null;
    
    switch (sourceField) {
      case 'display_name':
        value = metadata.display_name;
        break;
      case 'authorships':
        value = metadata.authorships?.map(a => a.author.display_name) || [];
        break;
      case 'publication_date':
        value = metadata.publication_date;
        break;
      case 'primary_location.source.display_name':
        value = metadata.primary_location?.source?.display_name;
        break;
      case 'doi':
        value = metadata.doi;
        break;
      case 'abstract':
        value = metadata.abstract;
        break;
      case 'keywords':
        value = metadata.keywords || [];
        break;
      case 'type':
        value = metadata.type;
        break;
      case 'concepts':
        value = metadata.concepts?.map(c => c.display_name) || [];
        break;
      case 'topics':
        value = metadata.topics?.map(t => t.display_name) || [];
        break;
    }
    
    if (value !== null && value !== undefined) {
      mapped[dcField] = value;
    }
  });
  
  return mapped;
}

async function handleDeposit() {
  const button = document.getElementById('depositButton');
  const results = document.getElementById('depositResults');
  
  button.disabled = true;
  button.textContent = 'Processing Deposit...';
  
  // Simulate deposit process
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const selectedCollection = document.getElementById('collectionSelect').value;
  const collectionName = sampleData.collections.find(c => c.id === selectedCollection)?.name || 'Selected Collection';
  
  results.innerHTML = `
    <div class="success-message">
      ✓ Successfully deposited ${processedDOIs.length} item(s) to QSpace repository!
    </div>
    <p><strong>Collection:</strong> ${collectionName}</p>
    <div class="repository-links">
      ${processedDOIs.map((doi, index) => `
        <a href="https://qspace.library.queensu.ca/handle/1974/${Math.floor(Math.random() * 100000)}" target="_blank" class="repo-link">
          🔗 View Item ${index + 1} in QSpace
        </a>
      `).join('')}
    </div>
  `;
  
  results.classList.remove('hidden');
  button.textContent = 'Deposit Complete';
}