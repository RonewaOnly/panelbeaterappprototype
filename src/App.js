import './App.css';
import MainScreen from './view/MainScreen';
import { AuthProvider } from './redux/reducers/authReducer';
import { FileProvider } from './redux/reducers/fileReducer';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <FileProvider>
          <MainScreen />
        </FileProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
