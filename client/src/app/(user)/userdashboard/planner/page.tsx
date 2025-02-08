"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { url } from '@/components/Url/page'
import { Clock, Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

export interface Root {
  result: Result
}

export interface Result {
  title: string
  description: string
  steps: Steps[]
}

export interface Steps {
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

  return (
    <div>
      <div className="flex items-center justify-center py-10 flex-col">
        <p className="text-center font-semibold text-teal-700 text-3xl">Generate a Plan</p>
        <div className="flex items-center gap-1 mt-5">
          <Input type="text" placeholder="What do you want to learn?" value={query} onChange={e => setquery(e.target.value)} />
          <Select onValueChange={setlevel}>
            <SelectTrigger className="w-[180px] border-teal-700">
              <SelectValue placeholder="Current Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button disabled={loading} onClick={generatePlan} className='bg-teal-700 hover:bg-teal-800'>
            {loading ? <Loader2 className='animate-spin mr-1' size={17} /> : <Sparkles className='mr-1' size={17} />} Generate
          </Button>
        </div>
        {loading && <p className='mt-5 text-center text-sm text-teal-500'>Generating a plan for you...</p>}

        {plan?.result&&plan?.result?.steps?.length > 0 && (
          <div className='mt-5 w-full max-w-3xl'>
            <p className='text-3xl font-semibold'>{plan.result.title}</p>
            <p className='text-sm text-gray-500 mt-2 mb-5'>{plan.result.description}</p>
            <Accordion type="single" collapsible>
              {plan.result.steps.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className='flex justify-end items-center'>
                    <p className='text-sm mr-2 flex-1'>{item.step}</p>
                    <div className='flex items-center'>
                      <Badge
                        className={item.difficulty === 'Beginner' ? 'bg-green-500' : item.difficulty === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-500'}
                      >{item.difficulty}</Badge>
                      <Badge className='bg-teal-700 ml-2 flex items-center'><Clock size={16} className='mr-1' />{item.time} days</Badge>
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
      </div>
    </div>
  )
}

export default PlannerPage
