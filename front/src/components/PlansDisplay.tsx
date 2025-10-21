import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Eye, Check, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Plan {
  id: number;
  title: string;
  area: string;
  rooms: string;
  floors: string;
  budget: string;
  preview: string;
}

const mockPlans: Record<string, Plan[]> = {
  en: [
    {
      id: 1,
      title: "Modern Minimalist",
      area: "350 m²",
      rooms: "4 Bedrooms, 3 Bathrooms",
      floors: "2 Floors",
      budget: "$450,000",
      preview: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Contemporary Classic",
      area: "420 m²",
      rooms: "5 Bedrooms, 4 Bathrooms",
      floors: "2 Floors + Basement",
      budget: "$580,000",
      preview: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Eco-Friendly Design",
      area: "380 m²",
      rooms: "4 Bedrooms, 3 Bathrooms",
      floors: "2 Floors",
      budget: "$520,000",
      preview: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Urban Villa",
      area: "500 m²",
      rooms: "6 Bedrooms, 5 Bathrooms",
      floors: "3 Floors",
      budget: "$750,000",
      preview: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Smart Home Layout",
      area: "390 m²",
      rooms: "4 Bedrooms, 3 Bathrooms",
      floors: "2 Floors",
      budget: "$540,000",
      preview: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Mediterranean Style",
      area: "450 m²",
      rooms: "5 Bedrooms, 4 Bathrooms",
      floors: "2 Floors + Rooftop",
      budget: "$680,000",
      preview: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    }
  ],
  ar: [
    {
      id: 1,
      title: "الحديث البسيط",
      area: "350 م²",
      rooms: "4 غرف نوم، 3 حمامات",
      floors: "طابقان",
      budget: "1,687,500 $",
      preview: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "الكلاسيكية المعاصرة",
      area: "420 م²",
      rooms: "5 غرف نوم، 4 حمامات",
      floors: "طابقان + قبو",
      budget: "2,175,000 $",
      preview: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "تصميم صديق للبيئة",
      area: "380 م²",
      rooms: "4 غرف نوم، 3 حمامات",
      floors: "طابقان",
      budget: "1,950,000 $",
      preview: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "فيلا حضرية",
      area: "500 م²",
      rooms: "6 غرف نوم، 5 حمامات",
      floors: "3 طوابق",
      budget: "2,812,500 $",
      preview: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "تخطيط المنزل الذكي",
      area: "390 م²",
      rooms: "4 غرف نوم، 3 حمامات",
      floors: "طابقان",
      budget: "2,025,000 $",
      preview: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "النمط المتوسطي",
      area: "450 م²",
      rooms: "5 غرف نوم، 4 حمامات",
      floors: "طابقان + سطح",
      budget: "2,550,000 $",
      preview: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    }
  ]
};

interface PlansDisplayProps {
  projectType: string;
  budget: number;
}

export function PlansDisplay({ projectType, budget }: PlansDisplayProps) {
  const { t, language } = useLanguage();
  const currentPlans = mockPlans[language] || mockPlans.en;
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handleView3D = (e: React.MouseEvent, planId: number) => {
    e.stopPropagation();
    toast.success(`Opening 3D view for Plan ${planId}`);
  };

  const handleDownloadPDF = (e: React.MouseEvent, planId: number) => {
    e.stopPropagation();
    toast.success(`Downloading PDF for Plan ${planId}`);
  };

  const handleSelectPlan = (e: React.MouseEvent, planId: number, title: string) => {
    e.stopPropagation();
    setSelectedPlanId(selectedPlanId === planId ? null : planId);
    toast.success(selectedPlanId === planId ? `Deselected: ${title}` : `Selected: ${title}`);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">{t('generatedPlans')}</h2>
          <p className="text-lg text-muted-foreground">
            AI-generated designs based on your {projectType} project with ${(budget/1000).toFixed(0)}K budget
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {currentPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden group hover:shadow-xl transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={plan.preview}
                  alt={plan.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Checkmark button removed as requested */}
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">{plan.title}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('areaLabelShort')}:</span>
                    <span className="font-semibold">{plan.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('layout')}:</span>
                    <span className="font-semibold">{plan.rooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('floorsLabel')}:</span>
                    <span className="font-semibold">{plan.floors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('estimatedCostLabel')}:</span>
                    <span className="font-semibold text-primary">{plan.budget}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => handleView3D(e, plan.id)}
                    disabled={selectedPlanId !== plan.id}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {t('view3D')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => handleDownloadPDF(e, plan.id)}
                    disabled={selectedPlanId !== plan.id}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>

                <Button
                  className={cn(
                    "w-full",
                    selectedPlanId === plan.id
                      ? "bg-green-600 hover:bg-green-600/90"
                      : "bg-primary hover:bg-primary/90"
                  )}
                  onClick={(e) => handleSelectPlan(e, plan.id, plan.title)}
                >
                  {selectedPlanId === plan.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {t('selected')}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {t('selectPlan')}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
