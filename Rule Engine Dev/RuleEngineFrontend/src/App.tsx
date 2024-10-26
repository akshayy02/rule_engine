import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface Rule {
  _id: string;
  name: string;
  ast: string;
  str: string;
}

export default function App() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [ruleString, setRuleString] = useState('');
  const [ruleName, setRuleName] = useState('');
  const [userData, setUserData] = useState({
    age: '',
    department: '',
    salary: '',
    experience: '',
  });
  const [result, setResult] = useState<boolean | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get(`${API_URL}/rules`);
      setRules(response.data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const handleCreateRule = async () => {
    try {
      await axios.post(`${API_URL}/rules`, {
        name: ruleName,
        ast: ruleString,
      });
      alert('Rule created successfully');
      setRuleString('');
      setRuleName('');
      fetchRules();
    } catch (error) {
      console.error('Error creating rule:', error);
      alert('Error creating rule');
    }
  };

  const handleEvaluate = async () => {
    try {
      const response = await axios.post(`${API_URL}/evaluate`, userData);
      setResult(response.data.eligible);
    } catch (error) {
      console.error('Error evaluating rules:', error);
      alert('Error evaluating rules');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 py-6">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition duration-300">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-800">Akshay's Rule Engine</h1>

        {/* Create Rule Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">Create Rule</h2>
          <input
            className="w-full p-3 mb-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            placeholder="Enter rule name"
          />
          <textarea
            className="w-full p-3 mb-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ruleString}
            onChange={(e) => setRuleString(e.target.value)}
            placeholder="Enter rule string"
            rows={4}
          />
          <button
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
            onClick={handleCreateRule}
          >
            Create Rule
          </button>
        </section>

        {/* Existing Rules Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">Existing Rules</h2>
          <ul className="space-y-3">
            {rules.map((rule) => (
              <li key={rule._id} className="bg-gray-50 p-4 rounded-md shadow-md hover:shadow-lg transition">
                <h3 className="text-lg font-bold text-blue-800">{rule.name}</h3>
                <p className="mt-2 text-gray-700"><span className="font-medium">Rule:</span> {rule.str}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Evaluate Rules Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">Evaluate Rules</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              placeholder="Age"
              value={userData.age}
              onChange={(e) => setUserData({ ...userData, age: e.target.value })}
            />
            <input
              className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Department"
              value={userData.department}
              onChange={(e) => setUserData({ ...userData, department: e.target.value })}
            />
            <input
              className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              placeholder="Salary"
              value={userData.salary}
              onChange={(e) => setUserData({ ...userData, salary: e.target.value })}
            />
            <input
              className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              placeholder="Experience"
              value={userData.experience}
              onChange={(e) => setUserData({ ...userData, experience: e.target.value })}
            />
          </div>
          <button
            className="w-full mt-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200"
            onClick={handleEvaluate}
          >
            Evaluate
          </button>
        </section>

        {/* Result Section */}
        {result !== null && (
          <section className="mt-8 p-6 bg-blue-50 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Result</h2>
            <p className={`text-lg font-bold ${result ? 'text-green-600' : 'text-red-600'}`}>
              User is {result ? 'eligible' : 'not eligible'} based on the rules.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
