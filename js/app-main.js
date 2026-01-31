// ============================================
// SECTION 1: AppState (Lines ~40-50)
// ============================================

const AppState = {
    currentMenu: 'main',
    currentSubmenu: null,
    chatHistory: [],
    // OLD: Separate webhooks for each category
    // n8nWebhook: 'https://n8n-workflow-test.duckdns.org/webhook-test/kurukshetra-chatbot',
    // n8nHeritageResearch: 'https://n8n-workflow-test.duckdns.org/webhook/kurukshetra-heritage-research',
    // n8nDemographics: 'https://n8n-workflow-test.duckdns.org/webhook/kurukshetra-demographics'
    
    // NEW: Single universal webhook for ALL categories
    n8nWebhook: 'https://n8n-workflow-test.duckdns.org/webhook-test/kurukshetra-chatbot',
    n8nUniversal: 'https://n8n-workflow-test.duckdns.org/webhook/kurukshetra-demographics' // Universal endpoint
};

// ============================================
// SECTION 2: Heritage Research Functions (Lines ~2800-2950)
// ============================================

// Submit Heritage Research - Ready Questions
async function submitHeritageReady() {
    const category = document.getElementById('heritage-category-select').value;
    const question = document.getElementById('heritage-question-select').value;
    
    if (!question) {
        alert('Please select a question');
        return;
    }
    
    showHeritageLoadingModal();
    
    try {
        // ✅ CHANGED: Using universal webhook instead of heritage-specific
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                queryType: 'HERITAGE_RESEARCH'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Heritage response:', data);
        
        closeHeritageLoadingModal();
        
        // Handle response
        let answer = '';
        if (data.formattedAnswer) {
            answer = data.formattedAnswer;
        } else if (data.answer) {
            answer = data.answer;
        } else {
            answer = 'No answer received from the system.';
        }
        
        showHeritageAnswerModal(question, answer);
        
    } catch (error) {
        closeHeritageLoadingModal();
        console.error('Error:', error);
        alert('Error fetching heritage information. Please try again.');
    }
}

// Submit Heritage Research - Custom Question
async function submitHeritageCustom() {
    const question = document.getElementById('heritage-custom-input').value.trim();
    
    if (!question) {
        alert('Please enter your question');
        return;
    }
    
    showHeritageLoadingModal();
    
    try {
        // ✅ CHANGED: Using universal webhook instead of heritage-specific
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                queryType: 'HERITAGE_RESEARCH'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Heritage response:', data);
        
        closeHeritageLoadingModal();
        
        // Handle response
        let answer = '';
        if (data.formattedAnswer) {
            answer = data.formattedAnswer;
        } else if (data.answer) {
            answer = data.answer;
        } else {
            answer = 'No answer received from the system.';
        }
        
        showHeritageAnswerModal(question, answer);
        
        // Clear input
        document.getElementById('heritage-custom-input').value = '';
        
    } catch (error) {
        closeHeritageLoadingModal();
        console.error('Error:', error);
        alert('Error fetching heritage information. Please try again.');
    }
}

// ============================================
// SECTION 3: Demographics Functions (Lines ~3300-3450)
// ============================================

// Submit Demographics - Ready Questions
async function submitDemoReady() {
    const category = document.getElementById('demo-category-select').value;
    const question = document.getElementById('demo-question-select').value;
    
    if (!question) {
        alert('Please select a question');
        return;
    }
    
    showDemoLoadingModal();
    
    try {
        // ✅ CHANGED: Using universal webhook instead of demographics-specific
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                queryType: 'DEMOGRAPHICS'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Demographics response:', data);
        
        closeDemoLoadingModal();
        
        // Handle response
        let answer = '';
        if (data.formattedAnswer) {
            answer = data.formattedAnswer;
        } else if (data.answer) {
            answer = data.answer;
        } else {
            answer = 'No answer received from the system.';
        }
        
        showDemoAnswerModal(question, answer);
        
    } catch (error) {
        closeDemoLoadingModal();
        console.error('Error:', error);
        alert('Error fetching statistics. Please try again.');
    }
}

// Submit Demographics - Custom Question
async function submitDemoCustom() {
    const question = document.getElementById('demo-custom-input').value.trim();
    
    if (!question) {
        alert('Please enter your question');
        return;
    }
    
    showDemoLoadingModal();
    
    try {
        // ✅ CHANGED: Using universal webhook instead of demographics-specific
        const response = await fetch(AppState.n8nUniversal, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                queryType: 'DEMOGRAPHICS'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Demographics response:', data);
        
        closeDemoLoadingModal();
        
        // Handle response
        let answer = '';
        if (data.formattedAnswer) {
            answer = data.formattedAnswer;
        } else if (data.answer) {
            answer = data.answer;
        } else {
            answer = 'No answer received from the system.';
        }
        
        showDemoAnswerModal(question, answer);
        
        // Clear input
        document.getElementById('demo-custom-input').value = '';
        
    } catch (error) {
        closeDemoLoadingModal();
        console.error('Error:', error);
        alert('Error fetching statistics. Please try again.');
    }
}

// ============================================
// SECTION 4: Loading Modals (Unchanged but verified)
// ============================================

// Show Heritage Loading Modal
function showHeritageLoadingModal() {
    const modal = document.createElement('div');
    modal.id = 'heritage-loading-modal';
    modal.className = 'heritage-modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 15px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <div class="spinner" style="width: 60px; height: 60px; border: 6px solid #f3f3f3; border-top: 6px solid #4a90e2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="font-size: 18px; color: #333; margin: 0;">Searching Heritage Information...</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close Heritage Loading Modal
function closeHeritageLoadingModal() {
    const modal = document.getElementById('heritage-loading-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Show Demographics Loading Modal
function showDemoLoadingModal() {
    const modal = document.createElement('div');
    modal.id = 'demo-loading-modal';
    modal.className = 'demo-modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 15px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <div class="spinner" style="width: 60px; height: 60px; border: 6px solid #f3f3f3; border-top: 6px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="font-size: 18px; color: #333; margin: 0;">Fetching Statistics...</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close Demographics Loading Modal
function closeDemoLoadingModal() {
    const modal = document.getElementById('demo-loading-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// ============================================
// SECTION 5: Answer Modals (Unchanged but verified)
// ============================================

// Show Heritage Answer Modal
function showHeritageAnswerModal(question, answer) {
    const modal = document.createElement('div');
    modal.id = 'heritage-answer-modal';
    modal.className = 'heritage-modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        overflow-y: auto;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; max-width: 800px; width: 100%; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); max-height: 90vh; display: flex; flex-direction: column;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 15px 15px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <i class="fas fa-landmark" style="font-size: 28px;"></i>
                    <h3 style="margin: 0; font-size: 22px;">Heritage Research Results</h3>
                </div>
                <button onclick="closeHeritageAnswerModal()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div style="padding: 30px; overflow-y: auto; flex: 1;">
                <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #667eea;">
                    <p style="margin: 0; color: #1e40af; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-question-circle"></i>
                        <span style="font-size: 15px;">Question:</span>
                    </p>
                    <p style="margin: 10px 0 0 0; color: #1e3a8a; font-size: 16px; line-height: 1.6;">${question}</p>
                </div>
                
                <div style="background: #fffbeb; padding: 25px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0 0 15px 0; color: #92400e; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-scroll"></i>
                        <span style="font-size: 15px;">Historical Information:</span>
                    </p>
                    <div style="color: #78350f; font-size: 15px; line-height: 1.8;">${answer}</div>
                </div>
                
                <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <p style="margin: 0; color: #991b1b; font-size: 13px; display: flex; align-items: start; gap: 10px;">
                        <i class="fas fa-exclamation-triangle" style="margin-top: 2px;"></i>
                        <span><strong>Note:</strong> Information is based on historical records and archaeological evidence. For academic research, please verify from primary sources.</span>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeHeritageAnswerModal();
        }
    });
}

// Close Heritage Answer Modal
function closeHeritageAnswerModal() {
    const modal = document.getElementById('heritage-answer-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Show Demographics Answer Modal
function showDemoAnswerModal(question, answer) {
    const modal = document.createElement('div');
    modal.id = 'demo-answer-modal';
    modal.className = 'demo-modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        overflow-y: auto;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; max-width: 800px; width: 100%; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); max-height: 90vh; display: flex; flex-direction: column;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 25px; border-radius: 15px 15px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <i class="fas fa-chart-bar" style="font-size: 28px;"></i>
                    <h3 style="margin: 0; font-size: 22px;">Statistics Results</h3>
                </div>
                <button onclick="closeDemoModal()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div style="padding: 30px; overflow-y: auto; flex: 1;">
                <div style="background: #eff6ff; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #1e40af; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-question-circle"></i>
                        <span style="font-size: 15px;">Question:</span>
                    </p>
                    <p style="margin: 10px 0 0 0; color: #1e3a8a; font-size: 16px; line-height: 1.6;">${question}</p>
                </div>
                
                <div style="background: #fffbeb; padding: 25px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0 0 15px 0; color: #92400e; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-database"></i>
                        <span style="font-size: 15px;">Data:</span>
                    </p>
                    <div style="color: #78350f; font-size: 15px; line-height: 1.8;">${answer}</div>
                </div>
                
                <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <p style="margin: 0; color: #991b1b; font-size: 13px; display: flex; align-items: start; gap: 10px;">
                        <i class="fas fa-info-circle" style="margin-top: 2px;"></i>
                        <span><strong>Note:</strong> Data is based on official sources. For latest statistics, refer to census and government reports.</span>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeDemoModal();
        }
    });
}

// Close Demographics Answer Modal
function closeDemoModal() {
    const modal = document.getElementById('demo-answer-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// ============================================
// SECTION 6: AppFunctions Export (Verify these exist)
// ============================================

// Make functions available globally
window.AppFunctions = {
    ...AppFunctions,
    submitHeritageReady,
    submitHeritageCustom,
    submitDemoReady,
    submitDemoCustom,
    showHeritageLoadingModal,
    closeHeritageLoadingModal,
    showHeritageAnswerModal,
    closeHeritageAnswerModal,
    showDemoLoadingModal,
    closeDemoLoadingModal,
    showDemoAnswerModal,
    closeDemoModal
};
