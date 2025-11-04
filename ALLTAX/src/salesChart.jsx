import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import data from './dataBase.json';
import './chartStyles.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  ChartLegend
);

const MONTHS = ['January', 'February', 'March', 'April'];

class SalesChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: '',
      selectedProduct: '',
      selectedBrand: '',
      categories: data.categorias || [],
      salesByBrand: data.vendas || {}
    };
  }

  getProductsForCategory(categoryName) {
    const category = this.state.categories.find((c) => c.nome === categoryName);
    return category ? category.produtos : [];
  }

  getBrandsForProduct(categoryName, productName) {
    const products = this.getProductsForCategory(categoryName);
    const product = products.find((p) => p.nome === productName);
    return product ? product.marcas : [];
  }

  buildChartPoints(salesArray) {
    const points = [];
    if (!Array.isArray(salesArray)) return points;
    for (let i = 0; i < salesArray.length; i += 1) {
      points.push({
        label: MONTHS[i] ?? `Month ${i + 1}`,
        value: salesArray[i]
      });
    }
    return points;
  }

  createChartData(selectedBrand) {
    if (!selectedBrand) {
      return { labels: [], datasets: [] };
    }
    const points = this.buildChartPoints(this.state.salesByBrand[selectedBrand] || []);
    return {
      labels: points.map((p) => p.label),
      datasets: [
        {
          label: selectedBrand,
          data: points.map((p) => p.value),
          fill: false,
          borderColor: '#00A8FF',
          backgroundColor: '#00A8FF',
          tension: 0.25,
          pointRadius: 3
        }
      ]
    };
  }

  render() {
    const {
      selectedCategory,
      selectedProduct,
      selectedBrand,
      categories
    } = this.state;

    const chartData = this.createChartData(selectedBrand);
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom' },
        tooltip: { enabled: true }
      },
      scales: {
        x: { title: { display: true, text: 'Month' } },
        y: { title: { display: true, text: 'Sales' }, beginAtZero: true }
      }
    };

    const products = this.getProductsForCategory(selectedCategory);
    const brands = this.getBrandsForProduct(selectedCategory, selectedProduct);

    return (
      <div className="chart-container">
        <header className="header-bar">
          <span className="header-left">Menu</span>
          <span className="header-right">Sales Report</span>
        </header>

        <div className="filters-container">
          <div>
            <p>Category:</p>
            <select
              value={selectedCategory}
              onChange={(e) =>
                this.setState({
                  selectedCategory: e.target.value,
                  selectedProduct: '',
                  selectedBrand: ''
                })
              }
            >
              <option value="">Choose a category</option>
              {categories.map((cat) => (
                <option key={cat.nome} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p>Product:</p>
            <select
              value={selectedProduct}
              onChange={(e) =>
                this.setState({ selectedProduct: e.target.value, selectedBrand: '' })
              }
              disabled={!selectedCategory}
            >
              <option value="">Choose a product</option>
              {products.map((prod) => (
                <option key={prod.nome} value={prod.nome}>
                  {prod.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p>Brand:</p>
            <select
              value={selectedBrand}
              onChange={(e) => this.setState({ selectedBrand: e.target.value })}
              disabled={!selectedProduct}
            >
              <option value="">Choose a brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="chart-title">
          {selectedBrand ? `Sales by Month for: ${selectedBrand}` : 'Select a brand'}
        </h2>

        <div style={{ width: '100%', height: 500 }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  }
}

export default SalesChart;
