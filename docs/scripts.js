const supaclient = supabase.createClient('https://rwkgoeawxetqkxpdxbqa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3a2dvZWF3eGV0cWt4cGR4YnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNzkwODUsImV4cCI6MjA2MzY1NTA4NX0.u-WnVLnLoEiI9FKg-epzkdD1WiY0fhoQgk6_Oyovu8Y')

async function loadLeagueTables() {
  // Fetch singles rows
  const { data: singles, error: singlesError } = await supaclient
    .from('league_table')
    .select('*')
    .eq('league', 'Singles');

  if (singlesError) {
    console.error('Error fetching Singles:', singlesError);
    return;
  }

  // Fetch doubles rows
  const { data: doubles, error: doublesError } = await supaclient
    .from('league_table')
    .select('*')
    .eq('league', 'Doubles');

  if (doublesError) {
    console.error('Error fetching Doubles:', doublesError);
    return;
  }

  // Render tables
  renderTable('singlesTable', singles);
  renderTable('doublesTable', doubles);
}

function renderTable(tableId, rows) {
  const table = document.getElementById(tableId);
  if (!table) {
    console.error(`Table element with id ${tableId} not found`);
    return;
  }

  table.innerHTML = '';

  if (!rows || rows.length === 0) {
    table.innerHTML = '<tr><td>No data found.</td></tr>';
    return;
  }

  // Remove 'league' from headers
  const headers = Object.keys(rows[0]).filter(h => h !== 'league');

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  headers.forEach((header, index) => {
    const th = document.createElement('th');
    th.textContent = header.replace('_', ' ').toUpperCase();

    // Set widths: first column 50%, others 25%
    if (index === 0) {
      th.style.width = '50%';
    } else {
      th.style.width = '25%';
    }

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    headers.forEach((header, index) => {
      const td = document.createElement('td');
      td.textContent = row[header];

      // Apply same widths to table data cells
      if (index === 0) {
        td.style.width = '50%';
      } else {
        td.style.width = '25%';
      }

      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
}

// Call load function once the page loads
window.addEventListener('DOMContentLoaded', () => {
  loadLeagueTables();
});

document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.getAttribute('data-tab');

    document.querySelectorAll('.tab-button').forEach(btn =>
      btn.classList.remove('active')
    );
    document.querySelectorAll('.tab-content').forEach(content =>
      content.classList.remove('active')
    );

    button.classList.add('active');
    document.getElementById(tab).classList.add('active');
  });
});
