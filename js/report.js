// ============================================
// js/report.js - PDF Report Generation
// ============================================

const ReportGenerator = {

    generate(formData) {
        const fd = formData || {};
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed;left:-9999px;top:0;width:210mm;background:white;';
        container.innerHTML = this.buildReportHTML(fd);
        document.body.appendChild(container);

        UI.showToast('Generating PDF…', 'info', 5000);

        const opt = {
            margin: 0,
            filename: `Valuation_${fd.registration_number || 'Report'}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: 'css' }
        };

        html2pdf().set(opt).from(container).save().then(() => {
            document.body.removeChild(container);
            UI.showToast('PDF downloaded!', 'success');
        });
    },

    v(fd, key, fb = '') { return fd[key] || fb; },

    // Renders all options for a checkbox group, showing ☑ for selected, ☐ for unselected
    checkboxRow(fd, label, key, options) {
        const selected = Array.isArray(fd[key]) ? fd[key] : (fd[key] ? [fd[key]] : []);
        const cells = options.map(opt => {
            const symbol = selected.includes(opt) ? '&#9745;' : '&#9744;';
            return `<span style="margin-right:10px;white-space:nowrap">${symbol} ${opt}</span>`;
        }).join('');
        return `<tr>
            <th style="width:35%">${label}</th>
            <td style="width:5px">:</td>
            <td>${cells}</td>
        </tr>`;
    },

    buildReportHTML(fd) {
        const v = (k, f='') => this.v(fd, k, f);
        const arr = (k) => Array.isArray(fd[k]) ? fd[k].join(', ') : (fd[k] || '');
        const cb = (label, key, options) => this.checkboxRow(fd, label, key, options);

        // Option sets (must match form.html definitions exactly)
        const twoOpts  = ['Yes', 'No'];
        const condOpts = ['Good', 'Fair', 'Moderate', 'Poor'];
        const autoMan  = ['Auto', 'Manual'];
        const builtMod = ['Built-in', 'Modified'];
        const origRep  = ['Original', 'Repaired'];

        const style = `
        <style>
            *{margin:0;padding:0;box-sizing:border-box;}
            body{font-family:'Book Antiqua',Palatino,serif;background:white;}
            .sheet{width:210mm;min-height:297mm;padding:15mm;page-break-after:always;}
            .sheet:last-child{page-break-after:auto;}
            h1{text-align:center;font-size:18px;text-transform:uppercase;margin-bottom:15px;}
            h2{font-size:14px;text-decoration:underline;margin:12px 0 6px;}
            table{width:100%;border-collapse:collapse;font-size:11px;margin:4px 0;}
            table,th,td{border:1px solid #000;}
            th,td{padding:3px 5px;vertical-align:middle;}
            th{font-weight:bold;}
            p{font-size:11px;margin-bottom:3px;}
            ol{padding-left:18px;font-size:11px;}
            li{margin-bottom:3px;}
        </style>`;

        const rows = (pairs) => pairs.map(([l,k,isArr]) => `
            <tr><th style="width:35%">${l}</th><td style="width:5px">:</td>
            <td>${isArr ? arr(k) : v(k)}</td></tr>`).join('');

        return style + `
        <div class="sheet">
            <h1>INSPECTION & VALUATION REPORT OF<br>USED/PRE-OWNED VEHICLE</h1>
            <table style="border:none;margin-bottom:15px;">
                <tr><th style="border:none;width:40%">Reference Account Name</th><td style="border:none">: ${v('reference_account_name')}</td></tr>
                <tr><th style="border:none">File Reference Number</th><td style="border:none">: ${v('file_reference_number')}</td></tr>
                <tr><th style="border:none">Referred By</th><td style="border:none">: ${v('referred_by')}</td></tr>
                <tr><th style="border:none">Date of Inspection</th><td style="border:none">: ${v('date_of_inspection')}</td></tr>
            </table>
            <table style="border:none;">
                <tr>
                    <td style="border:1px solid #000;padding:8px;width:48%;vertical-align:top">
                        <strong>Submitted by:</strong><br>AMK Associates Limited<br>
                        68, Khilgaon Chowdhurypara (4th floor)<br>DIT Road, Rampura, Dhaka-1219
                    </td>
                    <td style="border:none;width:4%"></td>
                    <td style="border:1px solid #000;padding:8px;width:48%;vertical-align:top">
                        <strong>Submitted to:</strong><br><strong>${v('recipient_name')}</strong><br>
                        <span style="white-space:pre-wrap">${v('recipient_address')}</span>
                    </td>
                </tr>
            </table>
        </div>

        <div class="sheet">
            <p>Ref.: ${v('letter_ref')}</p><p style="margin-bottom:15px">Date: ${v('letter_date')}</p>
            <p><strong>${v('recipient_name')}</strong></p>
            <p style="white-space:pre-wrap;margin-bottom:15px">${v('recipient_address')}</p>
            <p><strong>Re: Inspection & Valuation Report of used/pre-owned vehicle</strong></p>
            <p style="margin:10px 0">Dear Sir,</p>
            <p>Greetings from AMK Associates Limited and Thank You very much for referring us!</p>
            <p style="margin:8px 0;text-align:justify">Pursuant to your communication through ${v('comm_medium')}, dated: ${v('comm_date')} by ${v('comm_person')}, we, AMK Associates Limited has conducted the inspection and valuation of the referred vehicle, summary of which is as per following:</p>
            <table>
                <thead><tr><th>Maximum Price</th><th>Assessed Price</th><th>Forced Sale Value (20% Depreciation)</th></tr></thead>
                <tbody><tr>
                    <td style="text-align:center">${v('max_price')}</td>
                    <td style="text-align:center">${v('assessed_price')}</td>
                    <td style="text-align:center">${v('forced_sale_value')}</td>
                </tr></tbody>
            </table>
            <p style="margin:8px 0">As per our understanding, the aforementioned valuation is fair and reasonable and our responsibility is restricted within the physical existence of the used vehicle and the value thereof.</p>
            <p style="margin-bottom:30px">With best regards,</p>
            <table style="border:none">
                <tr>
                    <td style="border:none;width:45%;border-top:1px solid #000;padding-top:5px">
                        <strong>${v('valuer_1_name')}</strong><br>${v('valuer_1_designation')}
                    </td>
                    <td style="border:none;width:10%"></td>
                    <td style="border:none;width:45%;border-top:1px solid #000;padding-top:5px">
                        <strong>${v('valuer_2_name')}</strong><br>${v('valuer_2_designation')}
                    </td>
                </tr>
            </table>
        </div>

        <div class="sheet">
            <h2>Vehicle Details</h2>
            <table>${rows([
                ['Manufacturing Company','manufacturer',false],
                ['Trim/Package','trim_package',false],
                ['Vehicle Model','vehicle_model',false],
                ['Country of Origin','country_of_origin',false],
                ['Engine Number','engine_number',false],
                ['Chassis Number','chassis_number',false],
                ['Manufacturing Year','manufacturing_year',false],
                ['Cubic Capacity (CC)','cubic_capacity',false],
                ['Color','color',false],
                ['Type of Vehicle','vehicle_type',false],
                ['Fuel Used','fuel_used',true],
            ])}</table>
            <h2 style="margin-top:12px">Registration Details</h2>
            <table>${rows([
                ['Current Owner Name','owner_name',false],
                ['Registration Number','registration_number',false],
                ['Registration ID','registration_id',false],
                ['Registration Date','registration_date',false],
                ['Ownership Transfer Status','ownership_transfer',false],
                ['Insurance Policy Number & Date','insurance_policy',false],
                ['Tax Clearance Certificate Number','tax_clearance_number',false],
                ['Tax Clearance up to','tax_clearance_date',false],
                ['Fitness Certificate Number','fitness_cert_number',false],
                ['Fitness Validity up to','fitness_validity',false],
                ['Hire Purchase','hire_purchase',false],
            ])}</table>
        </div>

        <div class="sheet">
            <h2>Vehicle Inspection Details</h2>
            <table>
                <tr><th colspan="3">Interior</th></tr>
                ${cb('Transmission (Gear)',  'transmission',      autoMan)}
                ${cb('Ignition (Start)',      'ignition',          ['Push','Key'])}
                ${cb('Power Window',          'power_window',      autoMan)}
                ${cb('Power Steering',        'power_steering',    autoMan)}
                ${cb('Power Side Mirror',     'power_side_mirror', autoMan)}
                ${cb('Power Door Locks',      'power_door_locks',  twoOpts)}
                ${cb('Sound System',          'sound_system',      builtMod)}
                ${cb('Wooden Panel',          'wooden_panel',      twoOpts)}
                ${cb('Leather Interior',      'leather_interior',  twoOpts)}
                ${cb('Airbag',               'airbag',            twoOpts)}
                ${cb('Air Condition',         'air_condition',     condOpts)}
                ${cb('Back Camera',           'back_camera',       twoOpts)}
                ${cb('Ambient Lighting',      'ambient_lighting',  builtMod)}
                <tr><th style="width:35%">No. of Seats</th><td style="width:5px">:</td><td>${v('num_seats')}</td></tr>
                <tr><th style="width:35%">Total Mileage</th><td style="width:5px">:</td><td>${v('total_mileage')}</td></tr>
            </table>
            <table style="margin-top:8px">
                <tr><th colspan="3">Exterior</th></tr>
                ${cb('Body Condition',        'body_condition',    condOpts)}
                ${cb('Engine Condition',      'engine_condition',  condOpts)}
                ${cb('Tires Condition',       'tires_condition',   condOpts)}
                ${cb('Paint Condition',       'paint_condition',   condOpts)}
                ${cb('HID Lights',           'hid_lights',        condOpts)}
                ${cb('Major Defects',         'major_defects',     twoOpts)}
                ${cb('Chassis Repaired',      'chassis_repaired',  twoOpts)}
                ${cb('Alloy Rim',            'alloy_rim',         builtMod)}
                ${cb('Sun Roof',             'sun_roof',          twoOpts)}
                ${cb('Glass',               'glass',             origRep)}
                ${cb('Fog Light',           'fog_light',         twoOpts)}
                ${cb('Dimension',           'dimension',         ['Long','Hatchback','Saloon','SUV'])}
                ${cb('Major Accidental History','accidental_history',twoOpts)}
            </table>
        </div>

        <div class="sheet">
            <h2>Overall Assessment</h2>
            <table>${rows([
                ['Interior Condition','interior_condition',true],
                ['Exterior Condition','exterior_condition',true],
                ['Any Known Defects','known_defects',true],
            ])}</table>
            <h2 style="margin-top:12px">Inspection Particulars</h2>
            <table>${rows([
                ['Date of Inspection','inspection_date',false],
                ['Inspection Time','inspection_time',false],
                ['Location','inspection_location',false],
                ['Contact Person','contact_person',false],
                ['Verification Agent','verification_agent',false],
            ])}</table>
            <h2 style="margin-top:12px">Disclaimer</h2>
            <ol>
                <li>The valuation has been performed based on our physical inspection, verification, local market analysis and assessment to the best of our knowledge.</li>
                <li>AMK's responsibility is limited to the valuation of the said vehicle only without considering any legal matter related to the vehicle and documents.</li>
                <li>Except inspection and valuation of the said vehicle, AMK or any of its Official has no interest directly or indirectly in any manner whatsoever in the subject matter of this report.</li>
                <li>In case of Forced Sale Value, the rate is assumed on the basis of the vehicle's demand, price, marketability and other factors.</li>
                <li>This report is not intended to absolve the concerned parties from their contractual obligations.</li>
            </ol>
        </div>`;
    }
};
