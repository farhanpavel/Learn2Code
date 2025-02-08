"use client"
import { url } from '@/components/Url/page'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Result } from '../page'
import { Button } from '@/components/ui/button'
import { PlayCircle, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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
    <div className="p-4 px-10">
      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {plan && (
        <div className="px-10">
          <h2 className="text-2xl text-green-800 font-bold">{plan.title}</h2>
          <p className='text-gray-600 text-sm mt-5'>{plan.description}</p>
          <p className='text-sm mt-3'><strong className='mr-2'>Level:</strong>  
          <Badge className={plan.level === 'Beginner' ? 'bg-green-500' : plan.level === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-500'}>{plan.level}</Badge></p>
          <h3 className="font-semibold mt-10 text-green-800">Progress</h3>

          <div className="steps-list">
            <Accordion type="multiple">
            {plan.steps.map((step,index) => (
              <AccordionItem value={`item-${step._id}`} key={step._id} defaultChecked>
              <AccordionTrigger><Badge className="font-semibold bg-green-800 hover:bg-green-700">Day {index+1}</Badge> <p className="flex-1 ml-2">{step.step}</p>
              <Button size="sm" className='bg-green-800 hover:bg-green-900 mr-2' disabled={step.status=="Completed"}><PlayCircle className='mr-1' size={18}/> Start</Button>
              </AccordionTrigger>
              <AccordionContent>
                {/* {step.status == "Comple"} */}
              </AccordionContent>
            </AccordionItem>
            
              // <div key={step._id} className="step-card p-4 my-2 border rounded-lg">
              //   <p><strong>Day {index+1}:</strong> {step.step}</p>
              //   <p><strong>Difficulty:</strong> {step.difficulty}</p>
              //   <p><strong>Status:</strong> {step.status}</p>
              //   {step.status === 'Not Started' && (
              //     <button
              //       onClick={() => startStep(String(step._id))}
              //       className="bg-blue-500 text-white p-2 rounded mt-2"
              //     >
              //       Start Step
              //     </button>
              //   )}
              //   {step.status === 'In Progress' && (
              //     <button
              //       onClick={() => completeStep(String(step._id))}
              //       className="bg-green-500 text-white p-2 rounded mt-2"
              //     >
              //       Complete Step
              //     </button>
              //   )}
              // </div>
            ))}
            </Accordion>
          </div>

            <div className="flex justify-end mt-10">
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
