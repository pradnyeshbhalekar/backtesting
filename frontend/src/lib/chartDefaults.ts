import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import 'chartjs-adapter-date-fns'

Chart.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler)
