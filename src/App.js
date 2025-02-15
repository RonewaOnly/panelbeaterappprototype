import './App.css';
import MainScreen from './view/MainScreen';
import { AuthProvider } from './redux/reducers/authReducer';
import { FileProvider } from './redux/reducers/fileReducer';
import { CustomerProvider } from './redux/reducers/customerReducer';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <FileProvider>
          <CustomerProvider>
            <MainScreen />
          </CustomerProvider>
        </FileProvider>
      </AuthProvider>
    </div> 
  );
}

export default App;
