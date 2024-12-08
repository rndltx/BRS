'use client'

import { useState } from 'react'
import { withAuth } from '../../components/withAuth'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import Link from 'next/link'
import { HelpCircle, Mail } from 'lucide-react'

function AdminHelp() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const faqs = [
    {
      question: "How do I update the Vision & Mission statements?",
      answer: "Go to the Vision & Mission page in the admin panel. You&apos;ll find forms to edit both the vision and mission statements. After making your changes, click the &apos;Save Changes&apos; button to update the content."
    },
    {
      question: "How can I add new products to the website?",
      answer: "Navigate to the Products page in the admin panel. You&apos;ll find an &apos;Add New Product&apos; button. Click it, fill in the product details in the form, and submit to add a new product to the website."
    },
    {
      question: "How do I manage the image gallery?",
      answer: "The Gallery page in the admin panel allows you to upload, delete, and reorder images. To add new images, use the &apos;Upload Image&apos; button. To remove an image, click the delete icon next to it."
    },
    {
      question: "How can I change my admin password?",
      answer: "Go to the Profile page in the admin panel. You&apos;ll find a section to change your password. Enter your current password, then your new password twice to confirm. Click &apos;Update Password&apos; to save the changes."
    },
    {
      question: "How do I add or remove admin users?",
      answer: "User management is handled in the Settings page. You can add new admin users by providing their email and an initial password. To remove an admin, find their name in the list of users and click the &apos;Remove&apos; button."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Help Center</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Welcome to the CV. Berkat Rahmat Sejahtera admin help center. Here you can find answers to common questions and guidance on using the admin panel.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Shortcuts to important admin pages</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li><Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link></li>
              <li><Link href="/admin/vision-mission" className="text-blue-600 hover:underline">Vision & Mission</Link></li>
              <li><Link href="/admin/products" className="text-blue-600 hover:underline">Products</Link></li>
              <li><Link href="/admin/gallery" className="text-blue-600 hover:underline">Gallery</Link></li>
              <li><Link href="/admin/settings" className="text-blue-600 hover:underline">Settings</Link></li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>Contact our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">If you can&apos;t find the answer you&apos;re looking for, our support team is here to help.</p>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default withAuth(AdminHelp)

