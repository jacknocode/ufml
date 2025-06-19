import React, { useState, useEffect } from 'react'
import { marked } from 'marked'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import './App.css'

// ドキュメントファイルのマッピング
const docFiles = {
  'README.md': '/docs/README.md',
  'docs/CONCEPT.md': '/docs/CONCEPT.md',
  'llms.txt': '/docs/llms.txt',
  'LICENSE': '/docs/LICENSE',
  'docs/PRIVACY_POLICY.md': '/docs/PRIVACY_POLICY.md',
  'docs/TERMS_OF_SERVICE.md': '/docs/TERMS_OF_SERVICE.md'
}

const navItems = [
  { key: 'README.md', label: '概要', hash: 'readme' },
  { key: 'docs/CONCEPT.md', label: '設計思想', hash: 'concept' },
  { key: 'llms.txt', label: 'LLMs text', hash: 'llms' },
  { key: 'LICENSE', label: 'ライセンス', hash: 'license' },
  { key: 'docs/PRIVACY_POLICY.md', label: 'プライバシー', hash: 'privacy' },
  { key: 'docs/TERMS_OF_SERVICE.md', label: '利用規約', hash: 'terms' }
]

function App() {
  const [currentDoc, setCurrentDoc] = useState('README.md')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ドキュメントを読み込む関数
  const loadDocument = async (docKey) => {
    setLoading(true)
    setError(null)
    
    try {
      const docPath = docFiles[docKey]
      const response = await fetch(docPath)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const text = await response.text()
      
      // ファイル拡張子に基づいてレンダリング方法を決定
      let html
      if (docKey.endsWith('.md')) {
        html = marked.parse(text)
      } else {
        // プレーンテキストの場合
        html = `<pre><code>${text}</code></pre>`
      }
      
      setContent(html)
      
      // コードハイライトを適用（次のレンダリング後）
      setTimeout(() => {
        Prism.highlightAll()
      }, 0)
      
    } catch (err) {
      console.error('ドキュメントの読み込みに失敗しました:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ナビゲーションクリックハンドラー
  const handleNavClick = (docKey, hash) => {
    setCurrentDoc(docKey)
    window.location.hash = hash
    loadDocument(docKey)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 初期読み込み
  useEffect(() => {
    loadDocument(currentDoc)
  }, [])

  // ハッシュ変更の監視
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1)
      const navItem = navItems.find(item => item.hash === hash)
      if (navItem && navItem.key !== currentDoc) {
        setCurrentDoc(navItem.key)
        loadDocument(navItem.key)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [currentDoc])

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>UFML</h1>
          <p>User interface Flow Markup Language - AI/LLM連携を前提とした軽量マークアップ言語</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="container nav-container">
          <ul className="nav-list">
            {navItems.map(item => (
              <li key={item.key} className="nav-item">
                <a
                  href={`#${item.hash}`}
                  className={`nav-link ${currentDoc === item.key ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(item.key, item.hash)
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <div className="content">
            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>ドキュメントを読み込み中...</p>
              </div>
            )}
            
            {error && (
              <div className="error">
                <h1>エラー</h1>
                <p>ドキュメントの読み込みに失敗しました。</p>
                <p>エラー: {error}</p>
              </div>
            )}
            
            {!loading && !error && (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 UFML Project. </p>
        </div>
      </footer>
    </div>
  )
}

export default App