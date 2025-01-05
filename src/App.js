import './App.css';
import MainScreen from './view/MainScreen';
import { AuthProvider } from './redux/reducers/authReducer';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <MainScreen />
      </AuthProvider>
    </div>
  );
}

export default App;
