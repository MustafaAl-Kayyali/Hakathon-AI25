import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { UploadSection } from "@/components/UploadSection";
import { PlansDisplay } from "@/components/PlansDisplay";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const [showPlans, setShowPlans] = useState(false);
  const [projectConfig, setProjectConfig] = useState({
    projectType: "house",
    budget: 500000,
    file: null as File | null,
    floors: 1,
    area: 250,
    areaUnit: 'm2' as 'm2' | 'dunum'
  });
  const { t } = useLanguage();

  const handleGenerate = (data: {
    projectType: string;
    budget: number;
    file: File | null;
    floors: number;
    area: number;
    areaUnit: 'm2' | 'dunum';
  }) => {
    setProjectConfig({
      projectType: data.projectType,
      budget: data.budget,
      file: data.file,
      floors: data.floors,
      area: data.area,
      areaUnit: data.areaUnit
    });
    setShowPlans(true);
    // Scroll to plans after a brief delay
    setTimeout(() => {
      document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNewProject = () => {
    setShowPlans(false);
    // Reset project configuration to default values
    setProjectConfig({
      projectType: "house",
      budget: 500000,
      file: null,
      floors: 1,
      area: 250,
      areaUnit: 'm2'
    });
    // Scroll back to upload section
    setTimeout(() => {
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <div id="upload-section">
        <UploadSection
          key={`upload-section-${projectConfig.file ? 'with-file' : 'no-file'}`}
          onGenerate={handleGenerate}
          projectType={projectConfig.projectType}
          budget={projectConfig.budget}
          file={projectConfig.file}
          floors={projectConfig.floors}
          area={projectConfig.area}
          areaUnit={projectConfig.areaUnit}
        />
      </div>
      {showPlans && (
        <div id="plans-section" className="pb-16">
          <PlansDisplay
            projectType={projectConfig.projectType}
            budget={projectConfig.budget}
          />
          <div className="container mx-auto px-4 mt-8 max-w-4xl">
            <Button
              variant="outline"
              size="lg"
              className="w-full text-lg h-14"
              onClick={handleNewProject}
            >
              {t("newProject")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
