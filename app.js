// Open Access Paper Deposit Tool - Application Logic

class DepositToolApp {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 8;
        this.selectedRepository = null;
        this.selectedCollection = null;
        this.publications = [];
        this.depositData = {};
        
        this.initializeApp();
    }

    initializeApp() {
        this.loadRepositoryData();
        this.loadSampleData();
        this.bindEvents();
        this.updateProgress();
        this.updateStepDisplay();
    }

    loadRepositoryData() {
        this.repositories = {
            "qspace": {
                "name": "QSpace (Queen's University)",
                "collections": [
                    "Faculty of Arts & Science",
                    "Smith School of Business", 
                    "Faculty of Engineering & Applied Science",
                    "Faculty of Health Sciences",
                    "School of Graduate Studies",
                    "Faculty of Law",
                    "Faculty of Education"
                ]
            },
            "tspace": {
                "name": "TSpace (University of Toronto)",
                "collections": [
                    "Faculty Publications",
                    "Graduate Theses & Dissertations",
                    "Conference Papers & Presentations", 
                    "Research Data & Datasets",
                    "Special Collections & Archives"
                ]
            },
            "circle": {
                "name": "cIRcle (UBC)",
                "collections": [
                    "Theses and Dissertations",
                    "Faculty Research and Publications",
                    "Student Research Projects",
                    "Community and Partner Contributions",
                    "Open Educational Resources"
                ]
            },
            "atrium": {
                "name": "The Atrium (University of Guelph)",
                "collections": [
                    "Graduate Theses & Dissertations",
                    "Journal Articles and Preprints",
                    "Research Data and Datasets",
                    "Creative Works and Performances",
                    "Faculty Publications"
                ]
            }
        };

        this.resourceTypes = [
            {"value": "aam", "label": "Author Accepted Manuscript", "description": "Final author version including peer-review changes but before publisher formatting"},
            {"value": "preprint", "label": "PrePrint", "description": "Author's version before peer review and journal publication"},  
            {"value": "vor", "label": "Version of Record", "description": "Final published version with complete publisher formatting"}
        ];

        this.licenses = [
            {"value": "cc-by", "label": "CC BY", "description": "Attribution"},
            {"value": "cc-by-sa", "label": "CC BY-SA", "description": "Attribution-ShareAlike"},
            {"value": "cc-by-nd", "label": "CC BY-ND", "description": "Attribution-NoDerivs"},
            {"value": "cc-by-nc", "label": "CC BY-NC", "description": "Attribution-NonCommercial"},
            {"value": "cc-by-nc-sa", "label": "CC BY-NC-SA", "description": "Attribution-NonCommercial-ShareAlike"},
            {"value": "cc-by-nc-nd", "label": "CC BY-NC-ND", "description": "Attribution-NonCommercial-NoDerivs"}
        ];

        this.dublinCoreFields = [
            "dc.title",
            "dc.creator", 
            "dc.contributor.author",
            "dc.subject",
            "dc.date.issued",
            "dc.identifier.doi",
            "dc.description.abstract",
            "dc.publisher",
            "dc.type",
            "dc.rights"
        ];

        this.openalexFields = [
            {"value": "title", "label": "Title"},
            {"value": "authors", "label": "Authors"},
            {"value": "journal", "label": "Journal"},
            {"value": "year", "label": "Publication Year"},
            {"value": "doi", "label": "DOI"},
            {"value": "topics", "label": "Topics/Keywords"},
            {"value": "abstract", "label": "Abstract"},
            {"value": "publisher", "label": "Publisher"},
            {"value": "citations", "label": "Citation Count"},
            {"value": "type", "label": "Publication Type"}
        ];
    }

    loadSampleData() {
        this.samplePublications = [
            {
                "doi": "10.1038/s41586-021-03819-2",
                "title": "Machine learning applications in climate science: A comprehensive review",
                "authors": [
                    {"name": "Chen, Sarah", "orcid": "0000-0002-1234-5678", "affiliation": "Queen's University"},
                    {"name": "Rodriguez, Michael", "orcid": "0000-0003-2345-6789", "affiliation": "University of Toronto"}
                ],
                "journal": "Nature",
                "year": 2021,
                "citation_count": 34,
                "topics": ["Climate Science", "Machine Learning"],
                "abstract": "This comprehensive review examines the application of machine learning techniques in climate science research...",
                "publisher": "Nature Publishing Group",
                "openAccess": true
            },
            {
                "doi": "10.1126/science.abf1234", 
                "title": "Novel approaches to renewable energy storage systems",
                "authors": [
                    {"name": "Thompson, Emma", "orcid": "0000-0004-5678-9012", "affiliation": "Queen's University"},
                    {"name": "Wilson, James", "orcid": "0000-0005-6789-0123", "affiliation": "McGill University"}
                ],
                "journal": "Science",
                "year": 2022,
                "citation_count": 19,
                "topics": ["Renewable Energy", "Energy Storage"],
                "abstract": "We present novel approaches to renewable energy storage that address current limitations...",
                "publisher": "American Association for the Advancement of Science",
                "openAccess": false
            },
            {
                "doi": "10.1371/journal.pone.0245678",
                "title": "Biodiversity conservation in urban environments: A systematic approach", 
                "authors": [
                    {"name": "Park, Lisa", "orcid": "0000-0006-7890-1234", "affiliation": "Queen's University"},
                    {"name": "Kim, Robert", "orcid": "0000-0007-8901-2345", "affiliation": "University of British Columbia"}
                ],
                "journal": "PLOS ONE",
                "year": 2020,
                "citation_count": 27,
                "topics": ["Biodiversity", "Urban Ecology", "Conservation"],
                "abstract": "Urban environments present unique challenges for biodiversity conservation...",
                "publisher": "Public Library of Science",
                "openAccess": false
            }
        ];
    }

    bindEvents() {
        // Repository selection
        const repositorySelect = document.getElementById('repository');
        const collectionSelect = document.getElementById('collection');
        
        if (repositorySelect) {
            repositorySelect.addEventListener('change', (e) => {
                this.handleRepositoryChange(e.target.value);
            });
        }

        if (collectionSelect) {
            collectionSelect.addEventListener('change', (e) => {
                this.selectedCollection = e.target.value;
            });
        }

        // DOI sample buttons
        document.querySelectorAll('[data-doi]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.addSampleDOI(e.target.getAttribute('data-doi'));
            });
        });

        // Navigation buttons
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextStep();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousStep();
            });
        }
    }

    handleRepositoryChange(repositoryKey) {
        const collectionSelect = document.getElementById('collection');
        
        if (!collectionSelect) return;
        
        this.selectedRepository = repositoryKey;
        this.selectedCollection = null; // Reset collection selection
        
        if (repositoryKey && this.repositories[repositoryKey]) {
            collectionSelect.disabled = false;
            collectionSelect.innerHTML = '<option value="">Select a collection...</option>';
            
            this.repositories[repositoryKey].collections.forEach(collection => {
                const option = document.createElement('option');
                option.value = collection;
                option.textContent = collection;
                collectionSelect.appendChild(option);
            });
        } else {
            collectionSelect.disabled = true;
            collectionSelect.innerHTML = '<option value="">Select a repository first...</option>';
        }
    }

    addSampleDOI(doi) {
        const doiInput = document.getElementById('doiInput');
        if (!doiInput) return;
        
        const currentValue = doiInput.value.trim();
        
        if (currentValue) {
            // Check if DOI already exists
            const existingDOIs = this.parseDOIs(currentValue);
            if (!existingDOIs.includes(doi)) {
                doiInput.value = currentValue + '\n' + doi;
            }
        } else {
            doiInput.value = doi;
        }
    }

    parseDOIs(input) {
        return input.split(/[,\n]/)
            .map(doi => doi.trim())
            .filter(doi => doi.length > 0);
    }

    async nextStep() {
        if (await this.validateCurrentStep()) {
            if (this.currentStep < this.maxSteps) {
                this.currentStep++;
                await this.processStep();
                this.updateStepDisplay();
                this.updateProgress();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateProgress();
        }
    }

    async validateCurrentStep() {
        try {
            switch (this.currentStep) {
                case 1:
                    const repositorySelect = document.getElementById('repository');
                    const collectionSelect = document.getElementById('collection');
                    
                    if (!repositorySelect || !collectionSelect) {
                        console.error('Repository or collection select elements not found');
                        return false;
                    }
                    
                    const repository = repositorySelect.value;
                    const collection = collectionSelect.value;
                    
                    if (!repository || !collection) {
                        alert('Please select both a repository and collection.');
                        return false;
                    }
                    
                    this.selectedRepository = repository;
                    this.selectedCollection = collection;
                    return true;

                case 2:
                    const doiInput = document.getElementById('doiInput');
                    if (!doiInput) {
                        console.error('DOI input element not found');
                        return false;
                    }
                    
                    const doiInputValue = doiInput.value.trim();
                    if (!doiInputValue) {
                        alert('Please enter at least one DOI.');
                        return false;
                    }
                    
                    const dois = this.parseDOIs(doiInputValue);
                    if (dois.length === 0) {
                        alert('Please enter valid DOIs.');
                        return false;
                    }
                    
                    this.showLoading();
                    await this.fetchPublicationMetadata(dois);
                    this.hideLoading();
                    return true;

                default:
                    return true;
            }
        } catch (error) {
            console.error('Validation error:', error);
            this.hideLoading();
            return false;
        }
    }

    async fetchPublicationMetadata(dois) {
        this.publications = [];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        for (const doi of dois) {
            // Find sample data or create mock data
            let publication = this.samplePublications.find(pub => pub.doi === doi);
            
            if (!publication) {
                // Create mock data for unknown DOIs
                publication = {
                    doi: doi,
                    title: `Publication for DOI: ${doi}`,
                    authors: [{"name": "Unknown, Author", "affiliation": "Unknown"}],
                    journal: "Unknown Journal",
                    year: new Date().getFullYear(),
                    citation_count: 0,
                    topics: ["Unknown"],
                    abstract: "Abstract not available for this publication.",
                    publisher: "Unknown Publisher",
                    openAccess: Math.random() > 0.5
                };
            }
            
            this.publications.push({
                ...publication,
                needsUpload: !publication.openAccess,
                uploadedFile: null,
                resourceType: null,
                license: null
            });
        }
    }

    async processStep() {
        try {
            switch (this.currentStep) {
                case 3:
                    this.displayPublicationMetadata();
                    break;
                case 4:
                    this.displayPDFUploadSection();
                    break;
                case 5:
                    this.displayResourceTypeSection();
                    break;
                case 6:
                    this.displayFieldMapping();
                    break;
                case 7:
                    await this.simulateDeposit();
                    break;
                case 8:
                    this.displayCompletion();
                    break;
            }
        } catch (error) {
            console.error('Error processing step:', error);
        }
    }

    displayPublicationMetadata() {
        const container = document.getElementById('publicationCards');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.publications.forEach((pub, index) => {
            const card = document.createElement('div');
            card.className = 'publication-card';
            
            const authorsText = pub.authors.map(author => author.name).join(', ');
            const topicsHTML = pub.topics.map(topic => 
                `<span class="topic-tag">${topic}</span>`
            ).join('');
            
            card.innerHTML = `
                <h3 class="publication-title">${pub.title}</h3>
                <div class="publication-authors">${authorsText}</div>
                <div class="publication-meta">
                    <div class="meta-item">
                        <div class="meta-label">Journal</div>
                        <div class="meta-value">${pub.journal}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Year</div>
                        <div class="meta-value">${pub.year}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">DOI</div>
                        <div class="meta-value">${pub.doi}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Citations</div>
                        <div class="meta-value">${pub.citation_count}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Publisher</div>
                        <div class="meta-value">${pub.publisher}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Open Access</div>
                        <div class="meta-value">
                            <span class="status ${pub.openAccess ? 'status--open-access' : 'status--upload-required'}">
                                ${pub.openAccess ? 'Available' : 'Upload Required'}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Topics</div>
                    <div class="topics-list">${topicsHTML}</div>
                </div>
                <div class="publication-abstract">
                    <strong>Abstract:</strong> ${pub.abstract}
                </div>
            `;
            
            container.appendChild(card);
        });
    }

    displayPDFUploadSection() {
        const container = document.getElementById('pdfUploadSection');
        if (!container) return;
        
        container.innerHTML = '';
        
        const uploadsNeeded = this.publications.filter(pub => pub.needsUpload);
        
        if (uploadsNeeded.length === 0) {
            container.innerHTML = `
                <div class="status status--success">
                    All publications are already available in open access. No uploads required.
                </div>
            `;
            return;
        }
        
        uploadsNeeded.forEach((pub, index) => {
            const uploadDiv = document.createElement('div');
            uploadDiv.className = 'upload-item';
            
            uploadDiv.innerHTML = `
                <div class="upload-header">
                    <div class="upload-title">${pub.title}</div>
                    <span class="status status--upload-required">Upload Required</span>
                </div>
                <div class="upload-controls">
                    <div class="file-input-wrapper">
                        <input type="file" class="form-control" accept=".pdf" data-pub-index="${this.publications.indexOf(pub)}" style="display: none;">
                        <div class="file-input" onclick="this.previousElementSibling.click()">
                            <div class="file-input-text">Click to select PDF file or drag and drop</div>
                        </div>
                    </div>
                    <button class="btn btn--primary btn--sm" onclick="this.parentElement.querySelector('input[type=file]').click()">
                        Browse Files
                    </button>
                </div>
            `;
            
            const fileInput = uploadDiv.querySelector('input[type="file"]');
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e, parseInt(e.target.dataset.pubIndex));
            });
            
            container.appendChild(uploadDiv);
        });
    }

    handleFileUpload(event, pubIndex) {
        const file = event.target.files[0];
        if (file) {
            this.publications[pubIndex].uploadedFile = file;
            const wrapper = event.target.closest('.upload-item');
            const fileText = wrapper.querySelector('.file-input-text');
            if (fileText) {
                fileText.textContent = `Selected: ${file.name}`;
            }
        }
    }

    displayResourceTypeSection() {
        const container = document.getElementById('resourceTypeSection');
        if (!container) return;
        
        container.innerHTML = '';
        
        const uploadsNeeded = this.publications.filter(pub => pub.needsUpload);
        
        if (uploadsNeeded.length === 0) {
            container.innerHTML = `
                <div class="status status--success">
                    No resource type selection required for open access publications.
                </div>
            `;
            return;
        }
        
        uploadsNeeded.forEach((pub, index) => {
            const resourceDiv = document.createElement('div');
            resourceDiv.className = 'resource-item';
            
            const resourceOptions = this.resourceTypes.map(type => 
                `<option value="${type.value}">${type.label}</option>`
            ).join('');
            
            const licenseOptions = this.licenses.map(license => 
                `<option value="${license.value}">${license.label}</option>`
            ).join('');
            
            resourceDiv.innerHTML = `
                <div class="resource-header">${pub.title}</div>
                <div class="resource-controls">
                    <div class="form-group">
                        <label class="form-label">Resource Type</label>
                        <select class="form-control" data-pub-index="${this.publications.indexOf(pub)}" data-field="resourceType">
                            <option value="">Select resource type...</option>
                            ${resourceOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">License</label>
                        <select class="form-control" data-pub-index="${this.publications.indexOf(pub)}" data-field="license">
                            <option value="">Select license...</option>
                            ${licenseOptions}
                        </select>
                    </div>
                </div>
            `;
            
            // Add event listeners
            resourceDiv.querySelectorAll('select').forEach(select => {
                select.addEventListener('change', (e) => {
                    const pubIndex = parseInt(e.target.dataset.pubIndex);
                    const field = e.target.dataset.field;
                    this.publications[pubIndex][field] = e.target.value;
                });
            });
            
            container.appendChild(resourceDiv);
        });
    }

    displayFieldMapping() {
        const container = document.getElementById('fieldMappingSection');
        if (!container) return;
        
        const tableHTML = `
            <table class="mapping-table">
                <thead>
                    <tr>
                        <th>Dublin Core Field</th>
                        <th>OpenAlex Field</th>
                        <th>Sample Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.dublinCoreFields.map((dcField, index) => {
                        const openalexOptions = this.openalexFields.map(field => 
                            `<option value="${field.value}">${field.label}</option>`
                        ).join('');
                        
                        const samplePub = this.publications[0];
                        let sampleValue = '';
                        
                        if (samplePub) {
                            switch (dcField) {
                                case 'dc.title': sampleValue = samplePub.title || ''; break;
                                case 'dc.creator': 
                                case 'dc.contributor.author': 
                                    sampleValue = samplePub.authors?.map(a => a.name).join('; ') || ''; 
                                    break;
                                case 'dc.date.issued': sampleValue = samplePub.year || ''; break;
                                case 'dc.identifier.doi': sampleValue = samplePub.doi || ''; break;
                                case 'dc.publisher': sampleValue = samplePub.publisher || ''; break;
                                case 'dc.subject': sampleValue = samplePub.topics?.join('; ') || ''; break;
                                case 'dc.description.abstract': 
                                    sampleValue = samplePub.abstract?.substring(0, 50) + '...' || ''; 
                                    break;
                            }
                        }
                        
                        return `
                            <tr>
                                <td><strong>${dcField}</strong></td>
                                <td>
                                    <select class="form-control" data-dc-field="${dcField}">
                                        <option value="">Select mapping...</option>
                                        ${openalexOptions}
                                    </select>
                                </td>
                                <td><em>${sampleValue}</em></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
        
        // Set default mappings
        const mappings = {
            'dc.title': 'title',
            'dc.creator': 'authors',
            'dc.contributor.author': 'authors',
            'dc.date.issued': 'year',
            'dc.identifier.doi': 'doi',
            'dc.publisher': 'publisher',
            'dc.subject': 'topics',
            'dc.description.abstract': 'abstract'
        };
        
        Object.entries(mappings).forEach(([dcField, openalexField]) => {
            const select = container.querySelector(`[data-dc-field="${dcField}"]`);
            if (select) {
                select.value = openalexField;
            }
        });
    }

    async simulateDeposit() {
        const container = document.getElementById('depositProgress');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Create progress items for each publication
        this.publications.forEach((pub, index) => {
            const depositDiv = document.createElement('div');
            depositDiv.className = 'deposit-item';
            
            depositDiv.innerHTML = `
                <div class="deposit-header">
                    <div class="deposit-title">${pub.title}</div>
                    <span class="status status--info" id="status-${index}">Pending</span>
                </div>
                <div class="deposit-progress-bar">
                    <div class="deposit-progress-fill" id="progress-${index}"></div>
                </div>
            `;
            
            container.appendChild(depositDiv);
        });
        
        // Simulate deposit process
        for (let i = 0; i < this.publications.length; i++) {
            const statusEl = document.getElementById(`status-${i}`);
            const progressEl = document.getElementById(`progress-${i}`);
            
            if (statusEl && progressEl) {
                statusEl.textContent = 'Processing...';
                statusEl.className = 'status status--warning';
                
                // Animate progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 20;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        statusEl.textContent = 'Complete';
                        statusEl.className = 'status status--success';
                    }
                    progressEl.style.width = `${progress}%`;
                }, 200);
                
                // Wait for completion
                await new Promise(resolve => {
                    const checkComplete = () => {
                        if (progress >= 100) {
                            setTimeout(resolve, 500);
                        } else {
                            setTimeout(checkComplete, 100);
                        }
                    };
                    checkComplete();
                });
            }
        }
    }

    displayCompletion() {
        const container = document.getElementById('completionSummary');
        if (!container) return;
        
        const repositoryName = this.repositories[this.selectedRepository]?.name || 'Selected Repository';
        
        const summaryHTML = `
            <div class="completion-summary">
                <div class="summary-item">
                    <span>Repository:</span>
                    <span>${repositoryName}</span>
                </div>
                <div class="summary-item">
                    <span>Collection:</span>
                    <span>${this.selectedCollection}</span>
                </div>
                <div class="summary-item">
                    <span>Publications Deposited:</span>
                    <span>${this.publications.length}</span>
                </div>
                <div class="summary-item">
                    <span>Files Uploaded:</span>
                    <span>${this.publications.filter(pub => pub.needsUpload).length}</span>
                </div>
                <div class="summary-item">
                    <span>Open Access Available:</span>
                    <span>${this.publications.filter(pub => !pub.needsUpload).length}</span>
                </div>
            </div>
        `;
        
        container.innerHTML = summaryHTML;
    }

    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            }
        });
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }
        
        if (nextBtn) {
            if (this.currentStep === this.maxSteps) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'block';
                nextBtn.textContent = this.currentStep === this.maxSteps - 1 ? 'Complete' : 'Next';
            }
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const percentage = (this.currentStep / this.maxSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DepositToolApp();
});