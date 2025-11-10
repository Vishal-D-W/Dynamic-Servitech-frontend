// src/components/CalculatorTab.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/CalculatorTab.css';

const CalculatorTab = () => {
  const [dateTime, setDateTime] = useState('');
  const [tempDateTime, setTempDateTime] = useState('');
  const [passwordType, setPasswordType] = useState('bypass');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditingClock, setIsEditingClock] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const prevMinuteRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    setDateTime(fmtForInput(now));
    setTempDateTime(fmtForInput(now));
    prevMinuteRef.current = now.getMinutes();
  }, []);

  // Real-time clock + auto recalc each minute (not while editing)
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      if (!isEditingClock && prevMinuteRef.current !== now.getMinutes()) {
        prevMinuteRef.current = now.getMinutes();
        setDateTime(fmtForInput(now)); // triggers calc
      }
    }, 1000);
    return () => clearInterval(t);
  }, [isEditingClock]);

  // Auto calculate whenever date/time or type changes
  useEffect(() => {
    if (dateTime) calculate(true);
  }, [dateTime, passwordType]);

  const fmtForInput = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${dd}T${h}:${mm}`;
  };
  const fmtClock = (d) => {
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const y = d.getFullYear();
    return { t: `${h}:${m}:${s}`, d: `${dd}/${mo}/${y}` };
  };

  const startEdit = () => { setTempDateTime(dateTime); setIsEditingClock(true); };
  const cancelEdit = () => setIsEditingClock(false);
  const applyEdit = () => {
    setDateTime(tempDateTime);
    setCurrentTime(new Date(tempDateTime));
    prevMinuteRef.current = new Date(tempDateTime).getMinutes();
    setIsEditingClock(false);
  };

  // Helpers for local calculation
  const parts = (dt) => {
    // dt: 'yyyy-mm-ddThh:mm'
    const [date, time] = dt.split('T');
    const [y, m, d] = date.split('-').map((n) => parseInt(n, 10));
    const [hh, mm] = time.split(':').map((n) => parseInt(n, 10));
    return { y, m, d, hh, mm };
  };
  const last4 = (num) => {
    const s = String(Math.abs(num));
    return s.slice(-4).padStart(4, '0');
  };

  const calculate = async (silent = false) => {
    try {
      setError('');
      if (!silent) { setLoading(true); setMessage(''); setResult(null); }

      const { y, m, d, hh, mm } = parts(dateTime);

      let value = 0;
      let fullCalculation = '';
      let pwdTypeLabel = '';

      if (passwordType === 'bypass') {
        const left = y + m + d;
        const right = hh + mm;
        value = left * right;
      } else {
        // UPDATED FORMULA: (yyyy+mm+dd+hh+mm)*10 - hh + mm
        const base = y + m + d + hh + mm;
        value = base * 10 - hh + mm;
      }

      setResult({
        passwordType: pwdTypeLabel,
        fullCalculation,
        lastFourDigits: last4(value),
      });
      setMessage('Password calculated successfully');
    } catch (e) {
      setError('Calculation failed');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const { t, d } = fmtClock(currentTime);

  return (
    <div className="acd-page">
      <div className="acd-header">
        <div className="acd-header__icon">📲</div>
        <div>
          <h1 className="acd-title">ACD Password Calculator</h1>
          <p className="acd-subtitle">Select password type and calculate instantly</p>
        </div>
      </div>

      <div className="acd-card">
        <div className="acd-card__title">Enter Date & Time</div>
        <div className="acd-card__subtitle">Select the date and time to calculate passwords</div>

        <div className="acd-clock">
          <div className="acd-clock__box">
            <div className="acd-clock__time">{t}</div>
            <div className="acd-clock__date">{d}</div>
          </div>
          <button type="button" className="btn-edit" onClick={startEdit} title="Edit date and time">
            ✏️ Edit
          </button>
        </div>

        {isEditingClock && (
          <div className="edit-inline">
            <input
              type="datetime-local"
              className="input-datetime"
              value={tempDateTime}
              onChange={(e) => setTempDateTime(e.target.value)}
            />
            <div className="edit-actions">
              <button type="button" className="btn-primary btn-small" onClick={applyEdit}>Apply</button>
              <button type="button" className="btn-secondary btn-small" onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        )}

        <div className="form-block">
          <label className="label">Select Password Type</label>
          <div className="type-grid">
            <button
              type="button"
              className={`type-card ${passwordType === 'bypass' ? 'active' : ''}`}
              onClick={() => setPasswordType('bypass')}
              title="Formula: (yyyy+mm+dd)*(hh+mm)"
            >
              <span className="type-card__icon">🔑</span>
              <span className="type-card__title">ACD Bypass Password</span>
            </button>
            <button
              type="button"
              className={`type-card ${passwordType === 'menu' ? 'active' : ''}`}
              onClick={() => setPasswordType('menu')}
              title="Formula: (yyyy+mm+dd+hh+mm)*10-hh+mm"
            >
              <span className="type-card__icon">🔒</span>
              <span class
              Name="type-card__title">ACD Menu Password</span>
            </button>
          </div>

          <button type="button" className="btn-primary btn-full" onClick={() => calculate(false)} disabled={loading}>
            {loading ? 'Calculating…' : 'Calculate Password'}
          </button>
        </div>

        {message && <div className="alert success">✅ {message}</div>}
        {error && <div className="alert error">❌ {error}</div>}

        {result && (
          <div className="result">
            <div className="result__meta">
              <div className="result__type">{result.passwordType}</div>
              <div className="result__calc">{result.fullCalculation}</div>
            </div>
            <div className="result__value">{result.lastFourDigits}</div>
            <div className="result__note"></div>
          </div>
        )}

        <div className="note">Password auto-updates when the minute changes or when you edit the clock.</div>
      </div>
    </div>
  );
};

export default CalculatorTab;