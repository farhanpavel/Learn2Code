"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { url } from '@/components/Url/page'
import { toast } from '@/hooks/use-toast'
import { Clock, Loader2, Play, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export interface Root {
  result: Result
}

export interface Result {
  title: string
  description: string
  steps: Steps[]
  _id?: string
  level?: string
}

export interface Steps {
  _id?: string
  status?: string
  step: string
  difficulty: string
  time: number
  reference_links?: ReferenceLink[]
}

export interface ReferenceLink {
  title: string
  url: string
  type: string
  embed_url?: string
}

const PlannerPage = () => {
  const [query, setquery] = useState<string>('')
  const [level, setlevel] = useState<string>('')
  const [loading, setloading] = useState<boolean>(false)
  const [plan, setplan] = useState<Root | null>(null)
  const [allPlanners, setallPlanners] = useState<Result[]>([])

  const generatePlan = async () => {
    setloading(true)
    try {
      const res = await fetch(`${url}/api/planner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, level })
      })
      const data = await res.json()
      console.log(data)
      setplan(data)
    } catch (err) {
      console.error("Error fetching plan:", err)
    }
    setloading(false)
  }


  const fetchAllPlanners = async () => {
    setloading(true);
    try {
      const res = await fetch(`${url}/api/planner`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) {
        throw new Error('Failed to fetch planners');
      }
      
      const data = await res.json();
      setallPlanners(data); 
    } catch (err) {
      console.error("Error fetching planners:", err);
    }
    setloading(false);
  };
  

  // Assuming 'level' and other fields are coming from the client-side input
const createPlanner = async (payload:Result) => {
  const newPlannerData = {
    title: payload.title,
    description: payload.description,
    level: level,  // Make sure level is included here
    steps: payload.steps.map(step => ({
      step: step.step,
      difficulty: step.difficulty,
      time: step.time,
      reference_links: step.reference_links,
    })),
  };

  setloading(true);
  try {
    const res = await fetch(`${url}/api/planner/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlannerData),
    });

    if (!res.ok) {
      throw new Error('Failed to create planner');
    }

    const data = await res.json();
    console.log(data);
    toast({
      title: 'Planner created successfully',
      description: 'Your planner has been created successfully',
    })
    // Handle the successful creation response
  } catch (err) {
    console.error('Error creating planner:', err);
  }
  setloading(false);
};


  useEffect(() => {
    fetchAllPlanners();
  }, [])
  
  

  return (
    <div>
      <div className="flex items-center justify-center py-10 flex-col">
        <p className="text-center font-semibold text-green-800 text-3xl">Generate a Plan</p>
        <div className="flex items-center gap-1 mt-5">
          <Input type="text" placeholder="What do you want to learn?" value={query} onChange={e => setquery(e.target.value)} />
          <Select onValueChange={setlevel}>
            <SelectTrigger className="w-[180px] border-green-800">
              <SelectValue placeholder="Current Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button disabled={loading} onClick={generatePlan} className='bg-green-800 hover:bg-green-800'>
            {loading ? <Loader2 className='animate-spin mr-1' size={17} /> : <Sparkles className='mr-1' size={17} />} Generate
          </Button>
        </div>
        {loading && <p className='mt-5 text-center text-sm text-green-500'>Generating a plan for you...</p>}

        {plan?.result&&plan?.result?.steps?.length > 0 && (
          <div className='mt-5 w-full max-w-3xl'>
            <div className="flex items-center justify-between">
              <p className='text-3xl font-semibold'>{plan.result.title}</p>
              <Button onClick={() => createPlanner(plan.result)} className='bg-green-800 hover:bg-green-800'>Save Plan</Button>
            </div>
            
            <p className='text-sm text-gray-500 mt-2 mb-5'>{plan.result.description}</p>
            <Accordion type="single" collapsible>
              {plan.result.steps.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className='flex justify-end items-center'>
                    <div>
                      <p className='flex items-center justify-center rounded-full bg-green-800 text-white p-5'>{index+1}</p> 
                    </div>
                    <p className='text-sm mr-2 flex-1'>{item.step}</p>
                    <div className='flex items-center'>
                      <Badge
                        className={item.difficulty === 'Beginner' ? 'bg-green-500' : item.difficulty === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-500'}
                      >{item.difficulty}</Badge>
                      <Badge className='bg-green-800 ml-2 flex items-center'><Clock size={16} className='mr-1' />{item.time} days</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.reference_links?.map((link, i) => (
                      link.type === 'video' ? (
                        <iframe
                          key={i}
                          width="688"
                          height="387"
                          src={link.embed_url}
                          title={link.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          className='my-2 w-full'
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div key={i} className='my-3'>
                          <a href={link.url} target="_blank" className='text-xs w-[400px]' rel="noreferrer">
                            <Badge>Documentation</Badge> {link.title} <span className='underline italic text-blue-500'>({link.url})</span>
                          </a>
                        </div>
                      )
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
        {allPlanners.length > 0 && (
          <div className='m-10'>
            <p className='text-3xl text-tel-700 font-semibold'>All Planners</p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
              {allPlanners.map((item, index) => (
                <div key={index} className='bg-white shadow-md p-5 rounded-lg'>
                  <p className='text-lg font-semibold'>{item.title}</p>
                  <p className='text-xs text-gray-500 mt-2'>{item.description}</p>
                  <div className='flex items-center justify-between mt-3'>
                    <Badge className='bg-green-800'>{item.steps.length} Steps</Badge>
                    <Link href={`/userdashboard/planner/${item._id}`} className={buttonVariants({className:'bg-green-800 hover:bg-green-800'})}><Play size={15} className='mr-1'/> Resume</Link>
                  </div>
                </div>
              ))}
              </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default PlannerPage
