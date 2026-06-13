
/* ===================================================================
   NAVIGATION — hamburger, scroll spy, active link, back-to-top
   =================================================================== */
(function() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], footer[id]');
  const backToTop = document.getElementById('back-to-top');

  hamburger.addEventListener('click', function() {
    this.classList.toggle('open');
    mobileNav.classList.toggle('open');
    this.setAttribute('aria-expanded', this.classList.contains('open'));
  });

  window.closeMobileNav = function() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  // Scroll spy
  const observerOptions = { rootMargin: '-40% 0px -55% 0px' };
  const scrollObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) link.classList.add('active');
        });
      }
    });
  }, observerOptions);
  sections.forEach(function(sec) { scrollObserver.observe(sec); });

  // Back to top
  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  });
  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(function(el) { revealObserver.observe(el); });
})();

/* ===================================================================
   DEMO 1 — SUPPLY CHAIN FLOW
   =================================================================== */
(function() {
  const nodeData = [
    { title: 'Supplier', role: 'Provides raw materials and components', activities: 'Mining, farming, manufacturing parts', example: 'Samsung SDI (battery supplier)' },
    { title: 'Manufacturer', role: 'Converts raw materials into finished goods', activities: 'Assembly, production, quality control', example: 'Samsung Electronics' },
    { title: 'Distributor', role: 'Stores and moves goods between manufacturers and retailers', activities: 'Warehousing, bulk breaking, sorting', example: 'DHL Distribution' },
    { title: 'Retailer', role: 'Sells directly to end customers', activities: 'Display, promotions, customer service', example: 'Lotte Mart' },
    { title: 'Customer', role: 'Purchases and uses the final product', activities: 'Purchase, feedback, returns', example: 'End Consumer' }
  ];

  const nodes = document.querySelectorAll('.sc-node');
  const infoPanel = document.getElementById('scInfoPanel');
  const infoTitle = document.getElementById('scInfoTitle');
  const infoRole = document.getElementById('scInfoRole');
  const infoActivities = document.getElementById('scInfoActivities');
  const infoExample = document.getElementById('scInfoExample');
  const playBtn = document.getElementById('scPlayBtn');
  const resetBtn = document.getElementById('scResetBtn');
  const speedSlider = document.getElementById('scSpeed');
  const speedLabel = document.getElementById('scSpeedLabel');
  let animTimer = null;

  function showNodeInfo(idx) {
    const d = nodeData[idx];
    infoTitle.textContent = d.title;
    infoRole.innerHTML = '<strong>Role:</strong> ' + d.role;
    infoActivities.innerHTML = '<strong>Key Activities:</strong> ' + d.activities;
    infoExample.innerHTML = '<strong>Example:</strong> ' + d.example;
    infoPanel.classList.add('visible');
    nodes.forEach(function(n) { n.classList.remove('active'); });
    nodes[idx].classList.add('active');
  }

  nodes.forEach(function(node, i) {
    node.addEventListener('click', function() { showNodeInfo(i); });
    node.addEventListener('keypress', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showNodeInfo(i); } });
  });

  speedSlider.addEventListener('input', function() {
    var labels = ['Slow', 'Normal', 'Fast'];
    speedLabel.textContent = labels[this.value - 1];
  });

  playBtn.addEventListener('click', function() {
    var speeds = [1200, 700, 350];
    var speed = speeds[speedSlider.value - 1];
    var current = 0;
    nodes.forEach(function(n) { n.classList.remove('highlight'); });
    clearInterval(animTimer);
    animTimer = setInterval(function() {
      nodes.forEach(function(n) { n.classList.remove('highlight'); });
      if (current < nodes.length) {
        nodes[current].classList.add('highlight');
        showNodeInfo(current);
        current++;
      } else {
        clearInterval(animTimer);
      }
    }, speed);
  });

  resetBtn.addEventListener('click', function() {
    clearInterval(animTimer);
    nodes.forEach(function(n) { n.classList.remove('highlight', 'active'); });
    infoPanel.classList.remove('visible');
  });
})();

/* ===================================================================
   DEMO 2 — TRANSPORTATION MODE COMPARISON
   =================================================================== */
(function() {
  var modes = [
    { name: 'Road', icon: '🚛', data: { cost: 3, speed: 4, reliability: 4, capacity: 3, eco: 2 }, best: 'Best for local delivery' },
    { name: 'Rail', icon: '🚂', data: { cost: 4, speed: 3, reliability: 4, capacity: 5, eco: 4 }, best: 'Best for bulk freight' },
    { name: 'Sea',  icon: '🚢', data: { cost: 5, speed: 2, reliability: 3, capacity: 5, eco: 3 }, best: 'Best for international bulk' },
    { name: 'Air',  icon: '✈️', data: { cost: 1, speed: 5, reliability: 5, capacity: 2, eco: 1 }, best: 'Best for urgent shipments' }
  ];

  var barColors = { cost: '#2176FF', speed: '#F5A623', reliability: '#0EA472', capacity: '#0A2D6E', eco: '#7ec8e3' };
  var container = document.getElementById('transportCards');
  var costSlider = document.getElementById('costPriority');
  var speedSlider = document.getElementById('speedPriority');
  var reliSlider = document.getElementById('reliabilityPriority');
  var scenarioSelect = document.getElementById('scenarioSelect');

  function calcScore(m) {
    var cp = +costSlider.value, sp = +speedSlider.value, rp = +reliSlider.value;
    return m.data.cost * cp + m.data.speed * sp + m.data.reliability * rp + m.data.capacity + m.data.eco;
  }

  function render() {
    document.getElementById('costPriorityVal').textContent = costSlider.value;
    document.getElementById('speedPriorityVal').textContent = speedSlider.value;
    document.getElementById('reliabilityPriorityVal').textContent = reliSlider.value;

    var scored = modes.map(function(m, i) { return { idx: i, score: calcScore(m) }; });
    scored.sort(function(a, b) { return b.score - a.score; });
    var rankMap = {}; scored.forEach(function(s, r) { rankMap[s.idx] = r + 1; });

    var bestLabels = ['Best for local delivery', 'Best for bulk freight', 'Best for international bulk', 'Best for urgent shipments'];
    // Update best tags based on ranking
    var sortedForBest = scored.slice();
    if (sortedForBest[0]) modes[sortedForBest[0].idx].best = '🥇 Top choice for this scenario';

    container.innerHTML = '';
    modes.forEach(function(m, i) {
      var rank = rankMap[i];
      var card = document.createElement('div');
      card.className = 'transport-card' + (rank === 1 ? ' rank-1' : '');
      var badges = ['🥇 1st', '🥈 2nd', '🥉 3rd', '4th'];
      card.innerHTML =
        '<div class="transport-rank-badge">' + badges[rank - 1] + '</div>' +
        '<div class="transport-icon">' + m.icon + '</div>' +
        '<h4>' + m.name + '</h4>' +
        '<div class="transport-score">' + calcScore(m) + '</div>' +
        '<div class="transport-best">' + (rank === 1 ? '🥇 Top choice for this scenario' : m.best) + '</div>' +
        '<div class="mini-bars">' +
          miniBar('Cost', m.data.cost, barColors.cost) +
          miniBar('Speed', m.data.speed, barColors.speed) +
          miniBar('Reliability', m.data.reliability, barColors.reliability) +
          miniBar('Capacity', m.data.capacity, barColors.capacity) +
          miniBar('Eco Impact', m.data.eco, barColors.eco) +
        '</div>';
      container.appendChild(card);
    });
  }

  function miniBar(label, val, color) {
    return '<div class="mini-bar-row"><div class="mini-bar-label">' + label + '</div>' +
      '<div class="mini-bar-track"><div class="mini-bar-fill" style="width:' + (val * 20) + '%;background:' + color + ';"></div></div></div>';
  }

  costSlider.addEventListener('input', render);
  speedSlider.addEventListener('input', render);
  reliSlider.addEventListener('input', render);

  scenarioSelect.addEventListener('change', function() {
    var v = this.value;
    if (v === 'electronics') { costSlider.value = 3; speedSlider.value = 4; reliSlider.value = 5; }
    else if (v === 'produce') { costSlider.value = 2; speedSlider.value = 5; reliSlider.value = 4; }
    else if (v === 'coal') { costSlider.value = 5; speedSlider.value = 1; reliSlider.value = 3; }
    render();
  });

  render();
})();

/* ===================================================================
   DEMO 3 — WAREHOUSE LAYOUT
   =================================================================== */
(function() {
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
    layout.forEach(function(zone, i) {
      var cell = document.createElement('div');
      cell.className = 'wh-cell ' + zone;
      cell.dataset.zone = zone;
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('role', 'button');
      cell.setAttribute('aria-label', (zoneInfo[zone] ? zoneInfo[zone].name : 'Aisle'));
      cell.addEventListener('click', function() { showZoneInfo(zone); });
      cell.addEventListener('keypress', function(e) { if (e.key === 'Enter') showZoneInfo(zone); });
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
    cells.forEach(function(c) { c.style.opacity = c.dataset.zone === zone ? '1' : '0.4'; });
  }

  journeyBtn.addEventListener('click', function() {
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

  resetBtn.addEventListener('click', function() {
    dot.style.display = 'none';
    var cells = grid.querySelectorAll('.wh-cell');
    cells.forEach(function(c) { c.style.opacity = '1'; });
    infoTitle.textContent = 'Select a Zone';
    infoText.innerHTML = 'Click on any colored zone in the warehouse layout to see details about its function, equipment, and tips.';
  });

  standardBtn.addEventListener('click', function() {
    currentLayout = 'standard';
    standardBtn.classList.add('active-layout'); standardBtn.style.background = ''; standardBtn.style.color = ''; standardBtn.style.borderColor = '';
    crossDockBtn.classList.remove('active-layout'); crossDockBtn.style.background = 'var(--color-section-alt)'; crossDockBtn.style.color = 'var(--color-text-body)'; crossDockBtn.style.borderColor = 'var(--color-border)';
    renderGrid();
  });

  crossDockBtn.addEventListener('click', function() {
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
(function() {
  var dSlider = document.getElementById('eoqDemandSlider');
  var dInput  = document.getElementById('eoqDemand');
  var sSlider = document.getElementById('eoqOrderingSlider');
  var sInput  = document.getElementById('eoqOrdering');
  var hSlider = document.getElementById('eoqHoldingSlider');
  var hInput  = document.getElementById('eoqHolding');
  var canvas  = document.getElementById('eoqChart');
  var ctx     = canvas.getContext('2d');

  function sync(slider, input) {
    slider.addEventListener('input', function() { input.value = slider.value; calculate(); });
    input.addEventListener('input', function() { slider.value = input.value; calculate(); });
  }
  sync(dSlider, dInput);
  sync(sSlider, sInput);
  sync(hSlider, hInput);

  window.setEOQPreset = function(d, s, h) {
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
    [[' Ordering Cost', '#2176FF'], [' Holding Cost', '#F5A623'], [' Total Cost', '#0A2D6E']].forEach(function(item, idx) {
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
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(calculate, 200);
  });
})();

/* ===================================================================
   DEMO 5 — CARBON FOOTPRINT TOOL
   =================================================================== */
(function() {
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
    modeKeys.forEach(function(k) {
      emissions[k] = weight * dist * co2Rates[k];
      if (emissions[k] > maxEmission) maxEmission = emissions[k];
    });

    barsContainer.innerHTML = '';
    modeKeys.forEach(function(k, i) {
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
  routeSelect.addEventListener('change', function() {
    if (this.value !== 'custom') {
      distSlider.disabled = true;
    } else {
      distSlider.disabled = false;
    }
    calculate();
  });

  calculate();
})();
