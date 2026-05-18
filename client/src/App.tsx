import { Layout } from 'antd';
import Header from './components/Layout/Header';
import TodoTree from './components/TodoTree';
import './styles/global.css';

const { Content } = Layout;

function App() {
  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: 'transparent',
      position: 'relative',
      zIndex: 2
    }}>
      <Header />
      <Content style={{ 
        padding: '40px 50px', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        width: '100%' 
      }}>
        <div style={{ 
          background: 'rgba(22, 22, 31, 0.8)',
          backdropFilter: 'blur(20px)',
          padding: '32px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          minHeight: '600px',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards'
        }}>
          <TodoTree />
        </div>
      </Content>
    </Layout>
  );
}

export default App;