// File: Front/src/components/UploadSection.tsx

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Upload, FileText } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

interface UploadSectionProps {
  onGenerate: (data: {
    projectType: string;
    budget: number;
    file: File | null;
    floors: number;
    area: number;
    areaUnit: "m2" | "dunum";
  }) => void;
  projectType?: string;
  budget?: number;
  file?: File | null;
  floors?: number;
  area?: number | string;
  areaUnit?: "m2" | "dunum";
}

const acceptImage = "image/png, image/jpeg, image/jpg";
const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:3000";

export function UploadSection({
  onGenerate,
  projectType: propProjectType = "house",
  budget: propBudget = 500000,
  file: propFile = null,
  floors: propFloors = 1,
  area: propArea = 250,
  areaUnit: propAreaUnit = "m2",
}: UploadSectionProps) {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(propFile);
  const [projectType, setProjectType] = useState<string>(propProjectType);
  const [budget, setBudget] = useState<number>(propBudget);
  const [isDragging, setIsDragging] = useState(false);
  const [floors, setFloors] = useState<number>(propFloors);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [area, setArea] = useState<number | string>(propArea);
  const [areaUnit, setAreaUnit] = useState<"m2" | "dunum">(propAreaUnit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!propFile && fileInputRef.current) {
      fileInputRef.current.value = "";
      setFile(null);
    }
  }, [propFile]);

  const projectTypes = [
    { value: "house", label: t("house"), icon: "🏠" },
    { value: "school", label: t("school"), icon: "🏫" },
    { value: "university", label: t("university"), icon: "🎓" },
    { value: "commercial", label: t("commercial"), icon: "🏢" },
  ];

  const floorOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4+" },
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      toast.success(t("uploadSuccess"));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success(t("uploadSuccess"));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    if (!file) {
      toast.error(t("errorUploadFile"));
      return false;
    }
    if (!projectType) {
      toast.error(t("errorSelectProjectType"));
      return false;
    }
    const numericArea = Number(area);
    if (isNaN(numericArea) || numericArea <= 0) {
      toast.error(t("errorInvalidArea"));
      return false;
    }
    if (!floors || floors < 1) {
      toast.error(t("errorSelectFloors"));
      return false;
    }
    if (!budget || budget < 250000) {
      toast.error(t("errorInvalidBudget"));
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    const numericArea = Number(area);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("projectType", projectType);
      formData.append("budget", String(budget));
      formData.append("floors", String(floors));
      formData.append("area", String(numericArea));
      formData.append("areaUnit", areaUnit);
      if (file) formData.append("file", file);

      const res = await fetch(`${API_BASE}/api/v1/generate-plans`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Request failed");
      }

      toast.success(t("uploadSuccess"));
      onGenerate({
        projectType,
        budget,
        file,
        floors,
        area: numericArea,
        areaUnit,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage || t("errorProcessingRequest"));
    } finally {
      setIsLoading(false);
    }
  };

  const numericAreaForCheck = Number(area);
  const isAreaInvalid = isNaN(numericAreaForCheck) || numericAreaForCheck <= 0;

  const isGenerateDisabled =
    !file ||
    !projectType ||
    isAreaInvalid ||
    !floors ||
    budget < 250000 ||
    isLoading;

  const formatBudget = (value: number) => {
    const thousandSuffix = t("thousandSuffix");
    const millionSuffix = t("millionSuffix");

    if (value >= 1500000) {
      return `1.5${millionSuffix}+`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}${millionSuffix}`;
    }
    return `${(value / 1000).toFixed(0)}${thousandSuffix}`;
  };

  return (
    <section
      id="upload-section"
      className={`py-20 bg-muted/30 ${language === "ar" ? "font-arabic" : ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2
              className="text-4xl font-bold"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {t("uploadTitle")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("uploadDropDescription")}
            </p>
          </div>

          {/* Upload Card */}
          <Card className="p-8">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
                }`}
            >
              {file ? (
                <div className="space-y-4">
                  <FileText className="w-16 h-16 mx-auto text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleRemoveFile}
                    disabled={isLoading}
                  >
                    {t("remove")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      {t("uploadDropDescription")}
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      ref={fileInputRef}
                      className="hidden"
                      accept={acceptImage}
                      onChange={handleFileInput}
                      disabled={isLoading}
                    />
                    <Button asChild variant="default" disabled={isLoading}>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        {t("uploadButton")}
                      </label>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Configuration Card */}
          <Card className="p-8 space-y-8">
            {/* Project Type */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {t("projectType")}
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {projectTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setProjectType(type.value)}
                    className={`p-6 rounded-xl border-2 transition-all text-center ${projectType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                      }`}
                    disabled={isLoading}
                  >
                    <div className="text-4xl mb-2">{type.icon}</div>
                    <div className="font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Area */}
            <div className="space-y-4">
              <Label htmlFor="area-input" className="text-lg font-semibold">
                {t("areaLabel")}
              </Label>
              <div className="flex items-stretch gap-2">
                <Input
                  id="area-input"
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder={t("enterArea")}
                  className="text-lg h-12 flex-grow"
                  min="1"
                  disabled={isLoading}
                />
                <div className="flex rounded-md border border-input">
                  <Button
                    onClick={() => setAreaUnit("m2")}
                    variant={areaUnit === "m2" ? "default" : "ghost"}
                    className="rounded-r-none border-r"
                    disabled={isLoading}
                  >
                    {t("m2")}
                  </Button>
                  <Button
                    onClick={() => setAreaUnit("dunum")}
                    variant={areaUnit === "dunum" ? "default" : "ghost"}
                    className="rounded-l-none"
                    disabled={isLoading}
                  >
                    {t("dunum")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Floors */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {t("numberOfFloors")}
              </Label>
              <div className="grid grid-cols-4 gap-4">
                {floorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFloors(option.value)}
                    className={`p-6 rounded-xl border-2 transition-all text-center flex flex-col items-center justify-center ${floors === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                      }`}
                    disabled={isLoading}
                  >
                    <span className="text-3xl font-bold">{option.label}</span>
                    <span className="text-sm font-medium text-muted-foreground mt-1">
                      {t(option.value === 1 ? "floor" : "floors")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">
                  {t("budgetLabel")}
                </Label>
                <span className="text-2xl font-bold text-primary">
                  ${formatBudget(budget)}
                </span>
              </div>
              <Slider
                value={[budget]}
                onValueChange={(values) => setBudget(values[0])}
                min={250000}
                max={1500000}
                step={50000}
                className="py-4"
                disabled={isLoading}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t("budgetMin")}</span>
                <span>{t("budgetMax")}</span>
              </div>
            </div>

            {/* Generate Button */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg h-14"
                onClick={handleGenerate}
                disabled={isGenerateDisabled}
              >
                {isLoading
                  ? `${t("generating...")} ⏳`
                  : t("generatePlans")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
