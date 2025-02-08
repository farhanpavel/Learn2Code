"use client"
import { url } from '@/components/Url/page'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Result } from '../page'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

const PlannerPageSingle = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Result | null>(null);
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
  const startStep = async (stepId: string) => {
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
  const completeStep = async (stepId: string) => {
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
        router.back();
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
    <div className="p-4">
      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {plan && (
        <div className="planner-details">
          <h2 className="text-xl font-bold">{plan.title}</h2>
          <p>{plan.description}</p>
          <p><strong>Level:</strong> {plan.level}</p>
          <h3 className="text-lg font-semibold">Steps</h3>

          <div className="steps-list">
            {plan.steps.map((step) => (
              <div key={step._id} className="step-card p-4 my-2 border rounded-lg">
                <p><strong>Step:</strong> {step.step}</p>
                <p><strong>Difficulty:</strong> {step.difficulty}</p>
                <p><strong>Status:</strong> {step.status}</p>
                {step.status === 'Not Started' && (
                  <button
                    onClick={() => startStep(String(step._id))}
                    className="bg-blue-500 text-white p-2 rounded mt-2"
                  >
                    Start Step
                  </button>
                )}
                {step.status === 'In Progress' && (
                  <button
                    onClick={() => completeStep(String(step._id))}
                    className="bg-green-500 text-white p-2 rounded mt-2"
                  >
                    Complete Step
                  </button>
                )}
              </div>
            ))}
          </div>

            <div className="flex justify-end">
          <Button
            onClick={deletePlanner}
            variant="destructive"
          >
            <Trash2 size={17} className="mr-1"/> Delete
          </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerPageSingle;
