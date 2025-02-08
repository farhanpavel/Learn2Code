"use client"
import { url } from '@/components/Url/page'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const PlannerPageSingle = () => {
    const {id} = useParams()
    const router = useRouter()

    const [query, setQuery] = useState('');
    const [level, setLevel] = useState('');
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    const [allPlanners, setAllPlanners] = useState([]);
    const [error, setError] = useState('');

    // 📌 Get a Single Planner by ID
  const getPlannerById = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${url}/api/planner/${id}`);
      const data = await res.json();
      if (res.ok) {
        setPlan(data);
        console.log(data);
      } else {
        setError('Failed to fetch planner');
      }
    } catch (err) {
      console.error("Error fetching planner:", err);
      setError('An error occurred while fetching the planner.');
    }
    setLoading(false);
  };

  // 📌 Start a Step
  const startStep = async (stepId:string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${url}/api/planner/${id}/steps/${stepId}/start`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (res.ok) {
        console.log('Step started:', data);
        setPlan(data.planner);
      } else {
        setError('Failed to start step');
      }
    } catch (err) {
      console.error("Error starting step:", err);
      setError('An error occurred while starting the step.');
    }
    setLoading(false);
  };

  // 📌 Complete a Step
  const completeStep = async (stepId:string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${url}/api/planner/${id}/steps/${stepId}/complete`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (res.ok) {
        console.log('Step completed:', data);
        setPlan(data.planner);
      } else {
        setError('Failed to complete step');
      }
    } catch (err) {
      console.error("Error completing step:", err);
      setError('An error occurred while completing the step.');
    }
    setLoading(false);
  };

  // 📌 Delete a Planner
  const deletePlanner = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${url}/api/planner/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        console.log('Planner deleted');
        router.back()
      } else {
        setError('Failed to delete planner');
      }
    } catch (err) {
      console.error("Error deleting planner:", err);
      setError('An error occurred while deleting the planner.');
    }
    setLoading(false);
  };

  useEffect(() => {
    getPlannerById();
  }, []);


  return (
    <div>PlannerPageSingle</div>
  )
}

export default PlannerPageSingle