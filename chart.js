document.addEventListener('DOMContentLoaded', function() {
    const ctxSales = document.getElementById('salesChart').getContext('2d');
    const ctxTopProducts = document.getElementById('topProductsChart').getContext('2d');
    const ctxComponentPopularity = document.getElementById('componentPopularityChart').getContext('2d');
    const ctxNewChart = document.getElementById('newChart').getContext('2d');

    // Dummy data for Sales Trends
    new Chart(ctxSales, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [{
                label: 'Sales Trends',
                data: [100, 200, 150, 300, 250],
                backgroundColor: 'rgba(153, 102, 255, 0.4)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e3e6f0'
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                x: {
                    grid: {
                        color: '#e3e6f0'
                    },
                    ticks: {
                        color: '#666'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#333'
                    }
                }
            }
        }
    });

    // Dummy data for Top Products
    new Chart(ctxTopProducts, {
        type: 'doughnut',
        data: {
            labels: ['Product A', 'Product B', 'Product C', 'Product D'],
            datasets: [{
                label: 'Top Products',
                data: [50, 20, 15, 15],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.4)',
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(75, 192, 192, 0.4)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#333'
                    }
                }
            }
        }
    });

    // Dummy data for Component Popularity
    new Chart(ctxComponentPopularity, {
        type: 'pie',
        data: {
            labels: ['Component A', 'Component B', 'Component C', 'Component D'],
            datasets: [{
                label: 'Component Popularity',
                data: [40, 25, 20, 15],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(255, 206, 86, 0.4)',
                    'rgba(75, 192, 192, 0.4)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#333'
                    }
                }
            }
        }
    });

    // Dummy data for New Chart Placeholder
    new Chart(ctxNewChart, {
        type: 'bar',
        data: {
            labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
            datasets: [{
                label: 'New Chart Data',
                data: [30, 40, 50, 60],
                backgroundColor: 'rgba(75, 192, 192, 0.4)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e3e6f0'
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                x: {
                    grid: {
                        color: '#e3e6f0'
                    },
                    ticks: {
                        color: '#666'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#333'
                    }
                }
            }
        }
    });
});