const ctx = document.getElementById('investmentChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Investments',
      data: [5000, 10000, 7500, 12000],
      borderColor: '#f0b90b',
      backgroundColor: 'rgba(240, 185, 11, 0.2)',
      fill: true
    }]
  }
});