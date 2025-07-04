import { Instagram, Mail, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-8 px-4 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
        {/* Column 1: App Info */}
        <div>
          <h2 className="text-xl font-bold text-primary">Mindful Civic Journey</h2>
          <p className="mt-2 text-sm">
            Empowering youth with civic knowledge, mental health awareness, and drug prevention tools.
          </p>
        </div>

        

        {/* Column 3: Contact + Socials */}
        <div>
          <h3 className="text-sm font-semibold mb-3 ">Contact</h3>
            <p className="text-sm">For support or inquiries, reach out to me:</p>
          <div className="flex gap-4 mt-2">
            <a href="https://www.linkedin.com/in/ian-kiprotich-8816432a8?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BHdivnBk8SraMATDzS6VWXA%3D%3D" aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href="mailto:iankipro273@gmail.com" aria-label="Email"><Mail size={20} /></a>
            <p>Or call: +254795498932</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Made by Kiprotich. All rights reserved.
      </div>
    </footer>
  );
}
