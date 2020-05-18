		var chartColors = window.chartColors;
		var color = Chart.helpers.color;
		var config = {
			data: {
				datasets: [{
					data: [5, 5, 1, 2, 1], // Numerical Data in here
					backgroundColor: [
						color(chartColors.red).alpha(0.5).rgbString(),
						color(chartColors.orange).alpha(0.5).rgbString(),
						color(chartColors.yellow).alpha(0.5).rgbString(),
						color(chartColors.green).alpha(0.5).rgbString(),
						color(chartColors.blue).alpha(0.5).rgbString(),
					],
					label: 'My dataset' // for legend
				}],
				labels: ['Restrict human access', 'Injurious To People', 'Impact water quality', 'Injurious to fauna', 'Food Source To Pests'] // Label Data in here
			},
			options: {
				responsive: true,
				legend: {
					position: 'bottom',
				},
				title: {
					display: true,
					text: 'Major Impacts of the Weed'
				},
				scale: {
					ticks: {
						beginAtZero: true
					},
					reverse: false
				},
				animation: {
					animateRotate: false,
					animateScale: true
				}
			}
		};

		window.onload = function() {
			var ctx = document.getElementById('chart-area');
			window.myPolarArea = Chart.PolarArea(ctx, config);
			
		};

