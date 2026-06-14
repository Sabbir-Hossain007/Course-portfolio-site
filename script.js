
/* ===================================================================
   NAVIGATION — hamburger, scroll spy, active link, back-to-top
   =================================================================== */
(function () {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], footer[id]');
  const backToTop = document.getElementById('back-to-top');

  hamburger.addEventListener('click', function () {
    this.classList.toggle('open');
    mobileNav.classList.toggle('open');
    this.setAttribute('aria-expanded', this.classList.contains('open'));
  });

  window.closeMobileNav = function () {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  // Scroll spy
  const observerOptions = { rootMargin: '-40% 0px -55% 0px' };
  const scrollObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) link.classList.add('active');
        });
      }
    });
  }, observerOptions);
  sections.forEach(function (sec) { scrollObserver.observe(sec); });

  // Back to top
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(function (el) { revealObserver.observe(el); });
})();

/* ===================================================================
   DEMO 1 — DEPOT CONSOLIDATION CALCULATOR
   =================================================================== */
(function () {
  var depotSlider = document.getElementById('depotCount');
  var hubSlider = document.getElementById('hubCount');

  var BASE_STORAGE = 1000000;
  var BASE_TRANSPORT = 300000;
  var BASE_DELIVERY = 200000;

  function calculate() {
    var depots = +depotSlider.value;
    var hubs = +hubSlider.value;

    document.getElementById('depotCountVal').textContent = depots + ' Depots';
    document.getElementById('hubCountVal').textContent = hubs + ' Hub' + (hubs > 1 ? 's' : '');
    document.getElementById('beforeLocations').textContent = depots + ' Depots';
    document.getElementById('afterLocations').textContent = hubs + ' Hub' + (hubs > 1 ? 's' : '');

    // Square Root Law: new inventory ratio
    var sqrtRatio = Math.sqrt(hubs / depots);
    var invPct = Math.round(sqrtRatio * 100);
    document.getElementById('afterInventory').textContent = invPct + '% of original';

    // Formula display
    document.getElementById('depotFormula').innerHTML =
      '= 100% × √(' + hubs + ' ÷ ' + depots + ') = 100% × ' +
      sqrtRatio.toFixed(2) + ' = <strong>' + invPct + '% of original inventory</strong>';

    // Costs
    var afterStorage = Math.round(BASE_STORAGE * sqrtRatio);
    var afterTransport = Math.round(BASE_TRANSPORT * (1 + (1 - sqrtRatio) * 1.2));
    var afterDelivery = Math.round(BASE_DELIVERY * (0.5 + sqrtRatio * 0.4));

    var beforeTotal = BASE_STORAGE + BASE_TRANSPORT + BASE_DELIVERY;
    var afterTotal = afterStorage + afterTransport + afterDelivery;
    var savings = beforeTotal - afterTotal;

    document.getElementById('beforeStorage').textContent = '$' + BASE_STORAGE.toLocaleString();
    document.getElementById('beforeTransport').textContent = '$' + BASE_TRANSPORT.toLocaleString();
    document.getElementById('beforeDelivery').textContent = '$' + BASE_DELIVERY.toLocaleString();
    document.getElementById('beforeTotal').textContent = '$' + beforeTotal.toLocaleString();

    document.getElementById('afterStorage').textContent = '$' + afterStorage.toLocaleString();
    document.getElementById('afterTransport').textContent = '$' + afterTransport.toLocaleString();
    document.getElementById('afterDelivery').textContent = '$' + afterDelivery.toLocaleString();
    document.getElementById('afterTotal').textContent = '$' + afterTotal.toLocaleString();

    var badge = document.getElementById('depotSavingsBadge');
    var savingsEl = document.getElementById('depotSavingsVal');
    if (savings > 0) {
      savingsEl.textContent = '$' + savings.toLocaleString();
      badge.style.background = 'var(--color-success)';
    } else {
      savingsEl.textContent = '-$' + Math.abs(savings).toLocaleString();
      badge.style.background = '#e74c3c';
    }
  }

  depotSlider.addEventListener('input', calculate);
  hubSlider.addEventListener('input', calculate);
  calculate();
})();

/* ===================================================================
   DEMO 2 — STAR WARS SYSTEMS THINKING MAP
   =================================================================== */
(function () {
  var systems = [
    {
      id: 'transport', icon: '🚀', label: 'Transportation\nSystem',
      x: 260, y: 60, color: '#0A2D6E',
      starwars: 'AT-AT walkers, Star Destroyers, and Snowspeeders form the core transportation infrastructure of the Battle of Hoth — moving troops, equipment, and resources across the planet.',
      business: 'In real organizations, this is the logistics and fleet management system — managing vehicles, aircraft, and vessels to move goods and people efficiently.',
      challenge: 'The Empire\'s AT-AT walkers were slow and vulnerable to cable attacks, showing how transportation bottlenecks can undermine even the most powerful operations.'
    },
    {
      id: 'comms', icon: '📡', label: 'Communication\nSystem',
      x: 80, y: 170, color: '#1A4FA0',
      starwars: 'The Empire used probe droids and command centers on Executor to relay battlefield intelligence. The Rebels used an energy shield and a command center on Hoth.',
      business: 'This mirrors corporate IT and communication infrastructure — ERP systems, real-time data, and command centers that coordinate decisions across an organization.',
      challenge: 'The Rebels successfully delayed the Empire by maintaining their shield generator — showing how disrupting communications can halt even large-scale operations.'
    },
    {
      id: 'labor', icon: '👥', label: 'Labor &\nPersonnel System',
      x: 440, y: 170, color: '#2176FF',
      starwars: 'Stormtroopers, AT-AT pilots, Rebel soldiers, and Han Solo\'s team all represent the human capital executing the operation on both sides.',
      business: 'This is Human Resource Management — recruiting, training, assigning, and coordinating people to execute organizational goals efficiently.',
      challenge: 'Luke Skywalker\'s innovative use of a cable to bring down an AT-AT shows how human creativity and adaptability can overcome superior force — a core HR insight.'
    },
    {
      id: 'supply', icon: '📦', label: 'Supply Chain\nSystem',
      x: 100, y: 310, color: '#0EA472',
      starwars: 'The Rebel Alliance depended on supplies, weapons, and fuel arriving at Echo Base. The Empire\'s supply chain powered its fleet and ground forces throughout the battle.',
      business: 'Supply chain management in business ensures materials, inventory, and resources reach the right place at the right time — exactly as both sides needed during Hoth.',
      challenge: 'The Rebels\' limited supplies forced a quick evacuation — demonstrating that supply chain constraints directly determine operational capacity and strategic options.'
    },
    {
      id: 'intel', icon: '🔍', label: 'Intelligence\nSystem',
      x: 420, y: 310, color: '#F5A623',
      starwars: 'Imperial probe droids discovered the Rebel base, while Rebel scouts monitored the Empire\'s advance. Intelligence determined the timeline and outcome of the battle.',
      business: 'Market intelligence, competitive analysis, and data analytics serve the same function in business — understanding the environment before making strategic decisions.',
      challenge: 'The Rebels detected the probe droid late, giving them limited response time — mirroring how delayed market intelligence can force reactive rather than proactive strategy.'
    }
  ];

  var connections = [
    [0, 1], [0, 2], [0, 3], [0, 4], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]
  ];

  var svg = document.getElementById('swMapSvg');
  var infoDefault = document.getElementById('swInfoDefault');
  var infoDetail = document.getElementById('swInfoDetail');

  // Draw connections
  connections.forEach(function (pair) {
    var a = systems[pair[0]], b = systems[pair[1]];
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
    line.setAttribute('stroke', '#D8E2F0'); line.setAttribute('stroke-width', '2');
    svg.insertBefore(line, svg.firstChild);
  });

  // Draw nodes
  systems.forEach(function (sys) {
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'sw-node');
    g.setAttribute('data-id', sys.id);
    g.style.cursor = 'pointer';

    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', sys.x); circle.setAttribute('cy', sys.y);
    circle.setAttribute('r', '40');
    circle.setAttribute('fill', sys.color);
    circle.setAttribute('stroke', '#fff'); circle.setAttribute('stroke-width', '3');

    var icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('x', sys.x); icon.setAttribute('y', sys.y - 6);
    icon.setAttribute('text-anchor', 'middle'); icon.setAttribute('dominant-baseline', 'middle');
    icon.setAttribute('font-size', '22'); icon.textContent = sys.icon;

    var lines = sys.label.split('\n');
    lines.forEach(function (line, li) {
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', sys.x); t.setAttribute('y', sys.y + 14 + li * 14);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-size', '10');
      t.setAttribute('fill', '#fff');
      t.setAttribute('font-family', 'Poppins, sans-serif');
      t.setAttribute('font-weight', '600');
      t.textContent = line;
      g.appendChild(t);
    });

    g.appendChild(circle); g.appendChild(icon);
    lines.forEach(function (line, li) {
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', sys.x); t.setAttribute('y', sys.y + 14 + li * 14);
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('font-size', '10');
      t.setAttribute('fill', '#fff'); t.setAttribute('font-family', 'Poppins, sans-serif');
      t.setAttribute('font-weight', '600'); t.textContent = line;
      g.appendChild(t);
    });

    svg.appendChild(g);

    g.addEventListener('click', function () {
      // Deactivate all
      document.querySelectorAll('.sw-node circle').forEach(function (c) { c.setAttribute('stroke', '#fff'); c.setAttribute('stroke-width', '3'); });
      circle.setAttribute('stroke', '#F5A623'); circle.setAttribute('stroke-width', '5');

      infoDefault.style.display = 'none';
      infoDetail.style.display = 'block';
      document.getElementById('swInfoIcon').textContent = sys.icon;
      document.getElementById('swInfoTitle').textContent = sys.label.replace('\n', ' ');
      document.getElementById('swInfoStarWars').textContent = sys.starwars;
      document.getElementById('swInfoBusiness').textContent = sys.business;
      document.getElementById('swInfoChallenge').textContent = sys.challenge;
    });
  });
})();

/* ===================================================================
   DEMO 3 — WAREHOUSE LAYOUT
   =================================================================== */
(function () {
  var grid = document.getElementById('whGrid');
  var infoPanel = document.getElementById('whInfoPanel');
  var infoTitle = document.getElementById('whInfoTitle');
  var infoText = document.getElementById('whInfoText');
  var journeyBtn = document.getElementById('whJourneyBtn');
  var resetBtn = document.getElementById('whResetBtn');
  var standardBtn = document.getElementById('whStandardBtn');
  var crossDockBtn = document.getElementById('whCrossDockBtn');
  var dot = document.getElementById('whDot');

  var zoneInfo = {
    receiving: { name: 'Receiving Area', activity: 'Unloading incoming shipments, inspection, and quality verification.', equipment: 'Dock levelers, forklifts, pallet jacks, barcode scanners', tip: 'Schedule receiving windows to avoid congestion at loading docks.' },
    storage: { name: 'Storage Racks', activity: 'Long-term and short-term inventory storage in organized rack systems.', equipment: 'Pallet racks, shelving units, AS/RS systems', tip: 'Use ABC analysis to place high-turnover items closer to picking areas.' },
    picking: { name: 'Picking Area', activity: 'Order selection and retrieval from storage locations.', equipment: 'Pick carts, RF scanners, pick-to-light systems', tip: 'Batch similar orders to reduce travel time in the picking zone.' },
    packing: { name: 'Packing & Quality Check', activity: 'Final packaging, labeling, and quality inspection before shipping.', equipment: 'Packing tables, tape machines, scales, QC checklists', tip: 'Standardize packing procedures to maintain consistency and speed.' },
    shipping: { name: 'Shipping / Dispatch', activity: 'Staging outbound orders and loading onto transport vehicles.', equipment: 'Loading docks, staging lanes, shipping labels', tip: 'Sort by carrier and destination for faster loading sequences.' },
    office: { name: 'Office & Admin', activity: 'Management, inventory tracking, and coordination activities.', equipment: 'Computers, WMS software, communication systems', tip: 'Place office with visibility over the warehouse floor for quick oversight.' }
  };

  function buildStandardLayout() {
    var layout = [];
    for (var r = 0; r < 12; r++) {
      for (var c = 0; c < 20; c++) {
        var zone = 'aisle';
        if (c < 3) zone = 'receiving';
        else if (c >= 3 && c < 13) {
          if (r >= 1 && r <= 10) {
            if (r === 4 || r === 7) zone = 'aisle'; // aisle gaps
            else zone = 'storage';
          }
        }
        else if (c >= 13 && c < 15) zone = 'picking';
        else if (c >= 15 && c < 17) zone = 'packing';
        else if (c >= 17) zone = 'shipping';
        if (r < 2 && c >= 17) zone = 'office';
        layout.push(zone);
      }
    }
    return layout;
  }

  function buildCrossDockLayout() {
    var layout = [];
    for (var r = 0; r < 12; r++) {
      for (var c = 0; c < 20; c++) {
        var zone = 'aisle';
        if (c < 4) zone = 'receiving';
        else if (c >= 4 && c < 8) {
          if (r >= 2 && r <= 9 && r !== 5 && r !== 6) zone = 'storage';
        }
        else if (c >= 8 && c < 12) {
          if (r >= 1 && r <= 10) zone = 'picking';
        }
        else if (c >= 12 && c < 16) zone = 'packing';
        else if (c >= 16) zone = 'shipping';
        if (r < 2 && c >= 17) zone = 'office';
        layout.push(zone);
      }
    }
    return layout;
  }

  var currentLayout = 'standard';

  function renderGrid() {
    var layout = currentLayout === 'standard' ? buildStandardLayout() : buildCrossDockLayout();
    grid.innerHTML = '';
    layout.forEach(function (zone, i) {
      var cell = document.createElement('div');
      cell.className = 'wh-cell ' + zone;
      cell.dataset.zone = zone;
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('role', 'button');
      cell.setAttribute('aria-label', (zoneInfo[zone] ? zoneInfo[zone].name : 'Aisle'));
      cell.addEventListener('click', function () { showZoneInfo(zone); });
      cell.addEventListener('keypress', function (e) { if (e.key === 'Enter') showZoneInfo(zone); });
      grid.appendChild(cell);
    });
  }

  function showZoneInfo(zone) {
    if (!zoneInfo[zone]) {
      infoTitle.textContent = 'Safety Aisle';
      infoText.innerHTML = 'Open aisles allow safe passage for workers and equipment between warehouse zones.';
      return;
    }
    var z = zoneInfo[zone];
    infoTitle.textContent = z.name;
    infoText.innerHTML =
      '<p><strong>Primary Activity:</strong> ' + z.activity + '</p>' +
      '<p style="margin-top:8px;"><strong>Key Equipment:</strong> ' + z.equipment + '</p>' +
      '<p style="margin-top:8px;"><strong>💡 Tip:</strong> ' + z.tip + '</p>';
    // Highlight the zone
    var cells = grid.querySelectorAll('.wh-cell');
    cells.forEach(function (c) { c.style.opacity = c.dataset.zone === zone ? '1' : '0.4'; });
  }

  journeyBtn.addEventListener('click', function () {
    // Animate a dot through key positions
    dot.style.display = 'block';
    var container = grid.parentElement;
    var containerRect = container.getBoundingClientRect();
    var gridRect = grid.getBoundingClientRect();

    // Approximate positions (percentage of grid) for each zone
    var waypoints = [
      { x: 7, y: 50 },   // Receiving
      { x: 30, y: 50 },  // Storage
      { x: 67, y: 50 },  // Picking
      { x: 80, y: 50 },  // Packing
      { x: 92, y: 50 },  // Shipping
    ];
    var zoneSeq = ['receiving', 'storage', 'picking', 'packing', 'shipping'];
    var step = 0;

    function moveToNext() {
      if (step >= waypoints.length) { dot.style.display = 'none'; return; }
      var wp = waypoints[step];
      dot.style.left = wp.x + '%';
      dot.style.top = wp.y + '%';
      showZoneInfo(zoneSeq[step]);
      step++;
      setTimeout(moveToNext, 900);
    }
    moveToNext();
  });

  resetBtn.addEventListener('click', function () {
    dot.style.display = 'none';
    var cells = grid.querySelectorAll('.wh-cell');
    cells.forEach(function (c) { c.style.opacity = '1'; });
    infoTitle.textContent = 'Select a Zone';
    infoText.innerHTML = 'Click on any colored zone in the warehouse layout to see details about its function, equipment, and tips.';
  });

  standardBtn.addEventListener('click', function () {
    currentLayout = 'standard';
    standardBtn.classList.add('active-layout'); standardBtn.style.background = ''; standardBtn.style.color = ''; standardBtn.style.borderColor = '';
    crossDockBtn.classList.remove('active-layout'); crossDockBtn.style.background = 'var(--color-section-alt)'; crossDockBtn.style.color = 'var(--color-text-body)'; crossDockBtn.style.borderColor = 'var(--color-border)';
    renderGrid();
  });

  crossDockBtn.addEventListener('click', function () {
    currentLayout = 'crossdock';
    crossDockBtn.classList.add('active-layout'); crossDockBtn.style.background = ''; crossDockBtn.style.color = ''; crossDockBtn.style.borderColor = '';
    standardBtn.classList.remove('active-layout'); standardBtn.style.background = 'var(--color-section-alt)'; standardBtn.style.color = 'var(--color-text-body)'; standardBtn.style.borderColor = 'var(--color-border)';
    renderGrid();
  });

  renderGrid();
})();

/* ===================================================================
   DEMO 4 — EOQ CALCULATOR
   =================================================================== */
(function () {
  var dSlider = document.getElementById('eoqDemandSlider');
  var dInput = document.getElementById('eoqDemand');
  var sSlider = document.getElementById('eoqOrderingSlider');
  var sInput = document.getElementById('eoqOrdering');
  var hSlider = document.getElementById('eoqHoldingSlider');
  var hInput = document.getElementById('eoqHolding');
  var canvas = document.getElementById('eoqChart');
  var ctx = canvas.getContext('2d');

  function sync(slider, input) {
    slider.addEventListener('input', function () { input.value = slider.value; calculate(); });
    input.addEventListener('input', function () { slider.value = input.value; calculate(); });
  }
  sync(dSlider, dInput);
  sync(sSlider, sInput);
  sync(hSlider, hInput);

  window.setEOQPreset = function (d, s, h) {
    dSlider.value = dInput.value = d;
    sSlider.value = sInput.value = s;
    hSlider.value = hInput.value = h;
    calculate();
  };

  function calculate() {
    var D = +dInput.value, S = +sInput.value, H = +hInput.value;
    if (D <= 0 || S <= 0 || H <= 0) return;

    var eoq = Math.sqrt(2 * D * S / H);
    var ordersPerYear = D / eoq;
    var cycleDays = 365 / ordersPerYear;
    var totalOrdering = ordersPerYear * S;
    var totalHolding = (eoq / 2) * H;
    var totalCost = totalOrdering + totalHolding;

    document.getElementById('eoqValue').textContent = Math.round(eoq).toLocaleString();
    document.getElementById('eoqOrders').textContent = ordersPerYear.toFixed(1);
    document.getElementById('eoqCycle').textContent = Math.round(cycleDays);
    document.getElementById('eoqOrdCost').textContent = '$' + Math.round(totalOrdering).toLocaleString();
    document.getElementById('eoqHoldCost').textContent = '$' + Math.round(totalHolding).toLocaleString();
    document.getElementById('eoqTotalCost').textContent = '$' + Math.round(totalCost).toLocaleString();

    drawChart(D, S, H, eoq);
  }

  function drawChart(D, S, H, eoq) {
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    var w = rect.width, h = rect.height;

    ctx.clearRect(0, 0, w, h);

    var pad = { top: 40, right: 40, bottom: 50, left: 70 };
    var pw = w - pad.left - pad.right;
    var ph = h - pad.top - pad.bottom;

    // Determine range
    var maxQ = Math.min(eoq * 4, 50000);
    var steps = 100;
    var stepSize = maxQ / steps;

    // Calc max cost
    var maxCost = 0;
    for (var i = 1; i <= steps; i++) {
      var q = i * stepSize;
      var oc = (D / q) * S;
      var hc = (q / 2) * H;
      var tc = oc + hc;
      if (tc > maxCost) maxCost = tc;
    }
    maxCost *= 1.1;

    // Grid
    ctx.strokeStyle = '#e8edf5';
    ctx.lineWidth = 1;
    for (var gy = 0; gy <= 5; gy++) {
      var y = pad.top + (ph / 5) * gy;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + pw, y); ctx.stroke();
      ctx.fillStyle = '#7B8FAB'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'right';
      ctx.fillText('$' + Math.round(maxCost - (maxCost / 5) * gy).toLocaleString(), pad.left - 8, y + 4);
    }

    // X axis labels
    ctx.textAlign = 'center'; ctx.fillStyle = '#7B8FAB';
    for (var gx = 0; gx <= 5; gx++) {
      var xv = (maxQ / 5) * gx;
      var x = pad.left + (pw / 5) * gx;
      ctx.fillText(Math.round(xv).toLocaleString(), x, h - pad.bottom + 20);
    }

    // Axis titles
    ctx.fillStyle = '#3D4E6B'; ctx.font = '12px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Order Quantity', pad.left + pw / 2, h - 5);
    ctx.save();
    ctx.translate(15, pad.top + ph / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Annual Cost ($)', 0, 0);
    ctx.restore();

    function toX(q) { return pad.left + (q / maxQ) * pw; }
    function toY(c) { return pad.top + (1 - c / maxCost) * ph; }

    // Draw ordering cost line
    ctx.strokeStyle = '#2176FF'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 1; i <= steps; i++) {
      var q = i * stepSize;
      var oc = (D / q) * S;
      if (i === 1) ctx.moveTo(toX(q), toY(oc));
      else ctx.lineTo(toX(q), toY(oc));
    }
    ctx.stroke();

    // Draw holding cost line
    ctx.strokeStyle = '#F5A623'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 1; i <= steps; i++) {
      var q = i * stepSize;
      var hc = (q / 2) * H;
      if (i === 1) ctx.moveTo(toX(q), toY(hc));
      else ctx.lineTo(toX(q), toY(hc));
    }
    ctx.stroke();

    // Draw total cost line
    ctx.strokeStyle = '#0A2D6E'; ctx.lineWidth = 3;
    ctx.beginPath();
    for (var i = 1; i <= steps; i++) {
      var q = i * stepSize;
      var tc = (D / q) * S + (q / 2) * H;
      if (i === 1) ctx.moveTo(toX(q), toY(tc));
      else ctx.lineTo(toX(q), toY(tc));
    }
    ctx.stroke();

    // EOQ vertical dashed line
    var eoqX = toX(eoq);
    var eoqTC = (D / eoq) * S + (eoq / 2) * H;
    var eoqY = toY(eoqTC);
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(eoqX, pad.top); ctx.lineTo(eoqX, pad.top + ph); ctx.stroke();
    ctx.setLineDash([]);

    // EOQ dot
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath(); ctx.arc(eoqX, eoqY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(eoqX, eoqY, 3, 0, Math.PI * 2); ctx.fill();

    // EOQ label
    ctx.fillStyle = '#0A2D6E'; ctx.font = 'bold 12px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EOQ = ' + Math.round(eoq).toLocaleString(), eoqX, pad.top - 12);

    // Legend
    var lx = pad.left + pw - 180, ly = pad.top + 10;
    ctx.font = '11px Inter, sans-serif';
    [[' Ordering Cost', '#2176FF'], [' Holding Cost', '#F5A623'], [' Total Cost', '#0A2D6E']].forEach(function (item, idx) {
      ctx.fillStyle = item[1];
      ctx.fillRect(lx, ly + idx * 20, 16, 3);
      ctx.fillStyle = '#3D4E6B';
      ctx.textAlign = 'left';
      ctx.fillText(item[0], lx + 22, ly + idx * 20 + 5);
    });
  }

  calculate();

  // Redraw on resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(calculate, 200);
  });
})();

/* ===================================================================
   DEMO 5 — CARBON FOOTPRINT TOOL
   =================================================================== */
(function () {
  var weightSlider = document.getElementById('carbonWeight');
  var distSlider = document.getElementById('carbonDist');
  var routeSelect = document.getElementById('carbonRoute');
  var barsContainer = document.getElementById('carbonBars');

  var co2Rates = { air: 0.500, road: 0.096, rail: 0.028, sea: 0.011 };
  var modeNames = ['Air', 'Road (Truck)', 'Rail', 'Sea (Cargo Ship)'];
  var modeKeys = ['air', 'road', 'rail', 'sea'];
  var modeIcons = ['✈️', '🚛', '🚂', '🚢'];
  var deliveryDays = { air: '1-3', road: '5-10', rail: '7-14', sea: '20-45' };
  var costPerKg = { air: 4.5, road: 0.8, rail: 0.3, sea: 0.1 };

  var routes = {
    'busan-seoul': { dist: 325, label: 'Busan → Seoul' },
    'busan-shanghai': { dist: 870, label: 'Busan → Shanghai' },
    'busan-hamburg': { dist: 20000, label: 'Busan → Hamburg' }
  };

  function calculate() {
    var weight = +weightSlider.value;
    var dist = +distSlider.value;
    var route = routeSelect.value;

    document.getElementById('carbonWeightVal').textContent = weight + ' tonnes';
    document.getElementById('carbonDistVal').textContent = dist.toLocaleString() + ' km';

    if (route !== 'custom' && routes[route]) {
      dist = routes[route].dist;
      distSlider.value = dist;
      document.getElementById('carbonDistVal').textContent = dist.toLocaleString() + ' km';
    }

    var emissions = {};
    var maxEmission = 0;
    modeKeys.forEach(function (k) {
      emissions[k] = weight * dist * co2Rates[k];
      if (emissions[k] > maxEmission) maxEmission = emissions[k];
    });

    barsContainer.innerHTML = '';
    modeKeys.forEach(function (k, i) {
      var em = emissions[k];
      var pct = maxEmission > 0 ? (em / maxEmission) * 100 : 0;
      var trees = Math.ceil(em / 21);
      var cost = (weight * 1000 * costPerKg[k]).toLocaleString();
      var days = deliveryDays[k];
      var grade, gradeClass;
      if (em < 5000) { grade = 'A+'; gradeClass = 'grade-a'; }
      else if (em < 20000) { grade = 'B'; gradeClass = 'grade-b'; }
      else if (em < 100000) { grade = 'C'; gradeClass = 'grade-c'; }
      else { grade = 'D'; gradeClass = 'grade-d'; }

      var colors = ['#c0392b', '#e67e22', '#27ae60', '#16a085'];
      var row = document.createElement('div');
      row.className = 'carbon-bar-row';
      row.innerHTML =
        '<div class="carbon-mode-label">' + modeIcons[i] + ' ' + modeNames[i] + '</div>' +
        '<div class="carbon-bar-track"><div class="carbon-bar-fill" style="width:' + Math.max(pct, 2) + '%;background:' + colors[i] + ';">' + Math.round(em).toLocaleString() + ' kg CO₂</div></div>' +
        '<div class="carbon-bar-meta">' +
        '<span>🌳 ' + trees.toLocaleString() + ' trees to offset</span>' +
        '<span>💰 ~$' + cost + ' | 📅 ' + days + ' days</span>' +
        '<span>Green Score: <span class="carbon-grade ' + gradeClass + '">' + grade + '</span></span>' +
        '</div>';
      barsContainer.appendChild(row);
    });

    // Summary
    var savings = Math.round(emissions.air - emissions.sea);
    document.getElementById('carbonSavings').textContent = savings.toLocaleString();
  }

  weightSlider.addEventListener('input', calculate);
  distSlider.addEventListener('input', calculate);
  routeSelect.addEventListener('change', function () {
    if (this.value !== 'custom') {
      distSlider.disabled = true;
    } else {
      distSlider.disabled = false;
    }
    calculate();
  });

  calculate();
})();

/* ===================================================================
   PRESENTATION SLIDE NAVIGATOR
   =================================================================== */
(function () {
  var slidesData = [
    {
      title: 'About Our Company',
      points: [
        { icon: '🏢', text: 'Integrated Korea Education (IKE) — an educational consultancy company' },
        { icon: '📅', text: 'Started professionally in 2024' },
        { icon: '🎓', text: 'Specialized in Korean higher education' },
        { icon: '🇧🇩', text: 'Helping Bangladeshi students study in South Korea' },
        { icon: '📋', text: 'Providing complete admission and visa support' },
        { icon: '📍', text: 'Offices: Bangladesh (Dhaka) & Korea (Busan)' }
      ]
    },
    {
      title: 'Our Vision & Future Goals',
      points: [
        { icon: '🌟', text: 'Vision: To become a trusted educational consultancy' },
        { icon: '🤝', text: 'Support students with honesty and transparency' },
        { icon: '🚀', text: 'Help students build successful international careers' },
        { icon: '🇰🇷', text: 'Currently focused on South Korea' },
        { icon: '🌍', text: 'Planning to expand globally in the future' }
      ]
    },
    {
      title: 'Partner Universities',
      points: [
        { icon: '🏫', text: 'Dong-A University (Busan)' },
        { icon: '🏫', text: 'Kyungsung University (Busan)' },
        { icon: '🏫', text: 'Busan University of Foreign Studies' },
        { icon: '🏫', text: 'Sejong University (Seoul)' },
        { icon: '🏫', text: 'Konkuk University (Seoul)' },
        { icon: '🏫', text: 'Hansung University — and many more across South Korea' }
      ]
    },
    {
      title: 'Our 3-Step Process',
      points: [
        { icon: '1️⃣', text: 'Step 1 — Counseling: Academic profile, university & program recommendation' },
        { icon: '2️⃣', text: 'Step 2 — Admission & Visa: Document prep, applications, visa support' },
        { icon: '3️⃣', text: 'Step 3 — Post Arrival: Airport pickup, accommodation, university registration' },
        { icon: '📚', text: 'Programs: EAP, KAP, Bachelor\'s, Master\'s, PhD' }
      ]
    },
    {
      title: 'Student Success',
      points: [
        { icon: '🎉', text: 'March 2026 Intake: 50 successful applicants' },
        { icon: '📍', text: 'Students are now studying in different universities across Korea' },
        { icon: '💎', text: 'Strength: Personalized support for every student' },
        { icon: '🏆', text: 'Scholarship assistance programs' },
        { icon: '🛡️', text: 'Strong student care system — support before and after arrival' }
      ]
    },
    {
      title: 'Revenue Model',
      points: [
        { icon: '💰', text: 'University Commission: $500–$1,000 per student placed' },
        { icon: '💳', text: 'Student Service Charge: $500–$1,200 per student' },
        { icon: '📈', text: 'Business Performance: Approximately $50,000 USD last year' },
        { icon: '🔄', text: 'Dual revenue stream: universities + students' }
      ]
    },
    {
      title: 'Why Students Trust IKE',
      points: [
        { icon: '🇰🇷', text: 'Experienced founders living in Korea — firsthand knowledge' },
        { icon: '🌐', text: 'Direct support from both Bangladesh & Korea' },
        { icon: '✅', text: 'Transparent and ethical service' },
        { icon: '🎓', text: 'Scholarship support available' },
        { icon: '📋', text: 'Complete admission guidance from start to finish' },
        { icon: '💪', text: 'Strong student support system throughout the journey' }
      ]
    },
    {
      title: 'Future Plan',
      points: [
        { icon: '🤝', text: 'Increase university partnerships across Korea' },
        { icon: '🌏', text: 'Recruit more international students' },
        { icon: '🚀', text: 'Expand globally beyond Korea in the future' },
        { icon: '🔗', text: 'Build a strong international education network' },
        { icon: '💡', text: 'Message: "Education can change lives and create global opportunities."' }
      ]
    }
  ];

  var tabs = document.querySelectorAll('.pres-tab');
  var contentArea = document.getElementById('presSlideContent');

  function renderSlide(idx) {
    var slide = slidesData[idx];
    var pointsHTML = slide.points.map(function (p) {
      return '<div class="pres-slide-point"><span class="pres-slide-point-icon">' + p.icon + '</span><span>' + p.text + '</span></div>';
    }).join('');

    contentArea.innerHTML =
      '<div class="pres-slide-inner">' +
      '<h4>' + slide.title + '</h4>' +
      '<div class="pres-slide-points">' + pointsHTML + '</div>' +
      '</div>';
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
      renderSlide(i);
    });
  });

  // Render first slide on load
  if (tabs.length > 0 && contentArea) {
    renderSlide(0);
  }
})();
