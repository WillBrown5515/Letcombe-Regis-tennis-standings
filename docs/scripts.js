const supaclient = supabase.createClient('https://ajorqmlvqftlwwaazwzz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb3JxbWx2cWZ0bHd3YWF6d3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNjkwNDEsImV4cCI6MjA2Mzc0NTA0MX0.pNO94ebWIq1uCKw5eYgcvMfqFM4Om-Dvv6BvGYJtWbs')

function sortLeagueData(rows) {
  return rows.sort((a, b) => {
    // Sort by points DESC
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    // If points are equal, sort by games_played ASC
    return a.games_played - b.games_played;
  });
}

async function loadLeagueTables() {
  const { data: singles, error: singlesError } = await supaclient
    .from('league_table')
    .select('*')
    .eq('league', 'Singles');

  if (singlesError) {
    console.error('Error fetching Singles:', singlesError);
    return;
  }

  const { data: doubles, error: doublesError } = await supaclient
    .from('league_table')
    .select('*')
    .eq('league', 'Doubles');

  if (doublesError) {
    console.error('Error fetching Doubles:', doublesError);
    return;
  }

  // Sort the data before rendering
  const sortedSingles = sortLeagueData(singles);
  const sortedDoubles = sortLeagueData(doubles);

  renderTable('singlesTable', sortedSingles);
  renderTable('doublesTable', sortedDoubles);
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
