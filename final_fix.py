import re

with open('svrids-2027/register.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace old SVRIDS_TIERS and script
start_script = content.find('const SVRIDS_TIERS = {')
if start_script != -1:
    end_script = content.find('})();', start_script)
    if end_script != -1:
        new_script = '''const SVRIDS_TIERS = {
      virtual_student: { priceINR: 1999, priceUSD: 79, dodoINR: 'pdt_0Nd5kUGj8inKqSbyRdiVK', dodoUSD: 'pdt_0Nd5mroA8YckMQG8DFVpq' },
      virtual_faculty: { priceINR: 3999, priceUSD: 149, dodoINR: 'pdt_0NdOa8jMzPhic3qfAjnhK', dodoUSD: 'pdt_0NdOaDcqj1rebfVwnjkEE' },
      in_person_student: { priceINR: 3499, priceUSD: 139, dodoINR: 'pdt_0Nd5kUGj8inKqSbyRdiVK', dodoUSD: 'pdt_0Nd5mroA8YckMQG8DFVpq' },
      in_person_faculty: { priceINR: 5999, priceUSD: 249, dodoINR: 'pdt_0Nd5kYgKTGfwBr2VCG9Y9', dodoUSD: 'pdt_0Nd5mvbsjDzSK9eeKrn95' },
      startup_pitch: { priceINR: 4999, priceUSD: 199, dodoINR: 'pdt_0NdOa8jMzPhic3qfAjnhK', dodoUSD: 'pdt_0NdOaDcqj1rebfVwnjkEE' },
      listener: { priceINR: 1499, priceUSD: 59, dodoINR: 'pdt_0Nd5khVR6xzYWKMn2CiPn', dodoUSD: 'pdt_0Nd5oPQ5Pg5BpH35V79ry' },
      co_author: { priceINR: 2499, priceUSD: 99, dodoINR: 'pdt_0Nd5kme4fOVnzmFhWGdfD', dodoUSD: 'pdt_0Nd5oUQJh9bYUQYMFtlaL' }
    };

    let svGoldApplied = false;
    const goldToggle = document.getElementById('goldOptInToggle');
    if (goldToggle) {
        goldToggle.addEventListener('change', (e) => {
            svGoldApplied = e.target.checked;
            
            // Toggle visual styling
            const goldSwitchTrack = document.getElementById('goldSwitchTrack');
            const goldSwitchKnob = document.getElementById('goldSwitchKnob');
            const goldToggleLabel = document.getElementById('goldToggleLabel');
            const goldOptInCard = document.getElementById('goldOptInCard');
            
            if (svGoldApplied) {
                if (goldSwitchTrack) {
                    goldSwitchTrack.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                    goldSwitchTrack.style.borderColor = '#fbbf24';
                }
                if (goldSwitchKnob) {
                    goldSwitchKnob.style.transform = 'translateX(22px)';
                }
                if (goldToggleLabel) {
                    goldToggleLabel.textContent = 'Active ?';
                    goldToggleLabel.style.color = '#34d399';
                }
            } else {
                if (goldSwitchTrack) {
                    goldSwitchTrack.style.background = 'rgba(255, 255, 255, 0.15)';
                    goldSwitchTrack.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }
                if (goldSwitchKnob) {
                    goldSwitchKnob.style.transform = 'translateX(0px)';
                }
                if (goldToggleLabel) {
                    goldToggleLabel.textContent = 'Add Perk';
                    goldToggleLabel.style.color = '#94a3b8';
                }
            }
            updatePricingDisplay();
        });
    }

    const categorySelect = document.querySelector('select[name="category"]');
    if (categorySelect) {
        categorySelect.addEventListener('change', updatePricingDisplay);
    }
    
    function updatePricingDisplay() {
        if (!categorySelect) return;
        const cat = categorySelect.value;
        const tier = SVRIDS_TIERS[cat];
        if (!tier) return;
        
        let baseFee = tier.priceINR;
        let discount = svGoldApplied ? Math.round(baseFee * 0.15) : 0;
        let finalFee = baseFee - discount;
        
        const baseFeeDisplay = document.getElementById('baseFeeDisplay');
        const finalPriceDisplay = document.getElementById('finalPriceDisplay');
        const discountLineItem = document.getElementById('discountLineItem');
        const discountAmountDisplay = document.getElementById('discountAmountDisplay');
        const goldSavingsBadge = document.getElementById('goldSavingsBadge');
        
        if (baseFeeDisplay) baseFeeDisplay.textContent = '?' + baseFee.toLocaleString();
        if (finalPriceDisplay) finalPriceDisplay.textContent = '?' + finalFee.toLocaleString();
        if (discountLineItem) discountLineItem.style.display = discount > 0 ? 'flex' : 'none';
        if (discountAmountDisplay) discountAmountDisplay.textContent = '-?' + discount.toLocaleString();
        
        const possibleSavings = Math.round(baseFee * 0.15);
        if (goldSavingsBadge) goldSavingsBadge.textContent = 'Save ?' + possibleSavings.toLocaleString() + ' Instantly';
    }

    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(regForm);
            const categoryKey = formData.get('category');
            if (!categoryKey || !SVRIDS_TIERS[categoryKey]) return;
            const tierObj = SVRIDS_TIERS[categoryKey];
            const finalPrice = tierObj.priceINR - (svGoldApplied ? Math.round(tierObj.priceINR * 0.15) : 0);
            
            const regRecord = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                institution: formData.get('institution'),
                country: formData.get('country'),
                city: formData.get('city'),
                zip_code: formData.get('zip_code'),
                category: categoryKey,
                paper_id: formData.get('paper_id'),
                amount: finalPrice,
                status: 'pending'
            };

            try {
                if (window.SVSite && typeof window.SVSite.insertRecord === 'function') {
                    await window.SVSite.insertRecord('conf_registrations', regRecord);
                }
            } catch (err) {
                console.warn(err);
            }

            const product = tierObj.dodoINR;
            const emailEnc = encodeURIComponent(formData.get('email'));
            const returnUrl = encodeURIComponent(window.location.origin + window.location.pathname + '?payment=success');
            let checkoutUrl = 'https://checkout.dodopayments.com/buy/' + product
                + '?customer_email=' + emailEnc
                + '&return_url=' + returnUrl
                + '&metadata[conf_id]=svrids-2027'
                + '&metadata[tier]=' + encodeURIComponent(categoryKey);

            if (svGoldApplied) checkoutUrl += '&discount_code=GOLD15';
            
            window.location.href = checkoutUrl;
        });
    }
'''
        content = content[:start_script] + new_script + content[end_script:]

with open('svrids-2027/register.html', 'w', encoding='utf-8') as f:
    f.write(content)
