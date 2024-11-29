'use client'

import { useState, useEffect } from 'react'
import { collectFingerprint, calculatePrivacyScore, getPrivacyRecommendations } from '../app/utils/fingerprint'
import { Button } from '@/app/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/ui/card'
import { Progress } from '@/app/ui/progress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/ui/accordion'

export default function FingerprintDetector() {
  const [fingerprint, setFingerprint] = useState<any>(null)
  const [privacyScore, setPrivacyScore] = useState<number | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const detectFingerprint = async () => {
    setLoading(true)
    const fp = await collectFingerprint()
    setFingerprint(fp)
    const score = calculatePrivacyScore(fp)
    setPrivacyScore(score)
    const recs = getPrivacyRecommendations(fp, score)
    setRecommendations(recs)
    setLoading(false)
  }

  useEffect(() => {
    detectFingerprint()
  }, [])

  const fingerprintExplanations = {
    userAgent: "This tells websites what browser and operating system you're using.",
    screenResolution: "This shows the size of your screen, which can help identify your device.",
    colorDepth: "This is how many colors your screen can display.",
    timezone: "This indicates where you are in the world based on your local time.",
    language: "This is the language your browser is set to use.",
    platform: "This refers to the type of operating system your device is running.",
  }

  return (
    <div className="min-h-screen bg-[#16131F] text-gray-100 py-8">
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-2xl mx-auto bg-[#ffffff0a] border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-100 text-2xl">Browser Fingerprint Detector</CardTitle>
            <CardDescription className="text-gray-300">
              Find out how easily your device can be tracked online and get tips to protect your privacy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-300">Checking your browser details...</div>
            ) : (
              <>
                {privacyScore !== null && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-100">Your Privacy Score</h3>
                    <Progress value={privacyScore} className="w-full bg-gray-600" />
                    <p className="mt-2 text-gray-300">
                      Score: {privacyScore}/100 ({privacyScore < 50 ? 'Needs Improvement' : privacyScore < 80 ? 'Fair' : 'Great'})
                    </p>
                  </div>
                )}
                {fingerprint && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-100">Your Device Details</h3>
                    <ul className="space-y-2">
                      {Object.entries(fingerprintExplanations).map(([key, explanation]) => (
                        <li key={key} className="border-b border-gray-700 pb-2">
                          <span className="font-medium text-gray-300">{key}: </span>
                          <span className="text-gray-400">{fingerprint[key]}</span>
                          <p className="text-sm text-gray-500 mt-1">{explanation}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-100">Tips to Improve Your Privacy</h3>
                    <ul className="list-disc list-inside text-gray-400">
                      {recommendations.map((rec, index) => (
                        <li key={index} className="mb-1">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={detectFingerprint} className="bg-[#ffffff1a] hover:bg-gray-600 text-gray-100">Check Again</Button>
            <Button variant="outline" onClick={() => window.open('https://eyed.to')} className="bg-[#16131F] hover:bg-[#C28DFF] border-[#C28DFF] hover:text-black text-gray-100">
              Try Eyed Out Browser
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full max-w-2xl mx-auto mt-8 bg-[#ffffff0a] border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-100 text-2xl">Understanding Privacy and Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-gray-300 hover:text-gray-100">Why is privacy important?</AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Privacy is important because it helps keep your personal information safe from misuse. It protects you from identity theft and allows you to express yourself freely without fear of judgment or discrimination.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-gray-300 hover:text-gray-100">How can you protect your privacy?</AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  <p>Here are some simple ways to protect your online privacy:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Use browsers that focus on privacy, like Eyed Out.</li>
                    <li>Consider using a VPN to hide your location.</li>
                    <li>Regularly delete cookies and your browsing history.</li>
                    <li>Create strong, unique passwords for each of your accounts.</li>
                    <li>Be careful about what personal information you share online.</li>
                  </ul>
                  <p className="mt-2">
                    The <strong>Eyed Out Pro Plan</strong> offers extra features to help you stay private by blocking tracking methods and disguising your online identity.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-gray-300 hover:text-gray-100">How is the privacy score calculated?</AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  <p>Your privacy score is based on how identifiable your browser is. Here’s how it works:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Start with a score of 0.</li>
                    <li>Points are added for more generic and less identifiable features, and deducted for features that make you more identifiable, such as:
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li>+15 for generic user-agent strings.</li>
                        <li>+5 for common screen resolutions.</li>
                        <li>+15 for standard color depth.</li>
                        <li>+5 for UTC timezone.</li>
                        <li>+5 for English (US) language.</li>
                        <li>+5 for less common platforms (e.g., Linux, Android).</li>
                        <li>+10 for common screen orientations.</li>
                        <li>+10 for enabling cookies.</li>
                        <li>+10 for having a generic set of codecs.</li>
                        <li>+10 for having a large number of installed fonts.</li>
                      </ul>
                    </li>
                    <li>Points are deducted for identifiable traits, such as:
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li>-10 for specific operating systems (e.g., Windows, Mac).</li>
                        <li>-10 for uncommon screen resolutions.</li>
                        <li>-15 for non-standard color depths.</li>
                        <li>-10 for unique timezones.</li>
                        <li>-5 for non-English languages.</li>
                        <li>-10 for common platforms (e.g., Windows, Mac).</li>
                        <li>-20 for uncommon screen orientations.</li>
                        <li>-20 for disabling cookies.</li>
                        <li>-10 for having fewer codecs.</li>
                        <li>-10 for having fewer fonts.</li>
                      </ul>
                    </li>
                    <li>The final score is capped between 0 and 100.</li>
                  </ul>
                  <p className="mt-2">
                    A higher score means better privacy, while a lower score indicates a higher chance of being tracked.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-gray-300 hover:text-gray-100">What are the risks of being tracked online?</AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Being tracked can lead to unwanted ads, your data being sold, and even identity theft. It can also invade your privacy, making you feel less secure online.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-gray-300 hover:text-gray-100">What is fingerprinting?</AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Fingerprinting is a method used to identify and track users based on unique features of their devices. Unlike cookies, which can be deleted, fingerprints are harder to erase and can follow you across different websites.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-gray-300 hover:text-gray-100">How do I know if I&#39;m being tracked?</AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  You might notice you&#39;re being tracked if you see ads that match your recent searches or if you get unexpected emails related to your online activity. Using certain browser tools can help you spot tracking attempts.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-gray-300 hover:text-gray-100">What is Eyed Out Browser?</AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Eyed Out is a privacy-focused browser that blocks tracking attempts and protects your identity while you browse the web. It aims to help users maintain online anonymity and reduce the risk of being tracked by advertisers or malicious entities.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <footer className="w-full bg-[#16131F] flex flex-col text-center justify-center items-center py-4 mt-8">

          <span className="text-gray-300"> All data is processed locally. No information is sent to external servers.</span>

          <div className="mt-2">
            <Button variant="link" onClick={() => window.open('https://eyed.to')} >
              <img src="https://aploi.de/assets/img/logos.svg" alt="Eyed Out Logo" className="w-60 h-auto" />
            </Button>
          </div>

          <span className="text-gray-300">© 2024 Eyed™ by Aploide | All rights reserved.</span>

        </footer>
      </div>
    </div>
  )
}
