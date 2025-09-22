'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Eye, 
  Download,
  Brain,
  Zap,
  Target,
  BarChart3,
  Sparkles,
  File,
  Image,
  FileSpreadsheet,
  FileCode,
  Loader2
} from 'lucide-react'
import { ResumeData } from '@/services/resume-parser'
import { resumeParser } from '@/services/resume-parser'

interface ResumeUploadProps {
  onResumeParsed: (resumeData: ResumeData) => void
  onError: (error: string) => void
  isLoading?: boolean
}

export function ResumeUpload({ onResumeParsed, onError, isLoading = false }: ResumeUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [parsingProgress, setParsingProgress] = useState(0)
  const [isParsing, setIsParsing] = useState(false)
  const [parsedData, setParsedData] = useState<ResumeData | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploadedFile(file)
    setUploadProgress(0)
    setParsingProgress(0)
    setIsParsing(true)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Parse resume
      setParsingProgress(0)
      const resumeData = await parseResumeWithProgress(file)
      setParsedData(resumeData)
      onResumeParsed(resumeData)
    } catch (error) {
      console.error('Resume parsing failed:', error)
      onError(error instanceof Error ? error.message : 'Failed to parse resume')
    } finally {
      setIsParsing(false)
    }
  }, [onResumeParsed, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/rtf': ['.rtf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  const parseResumeWithProgress = async (file: File): Promise<ResumeData> => {
    // Simulate parsing progress
    const progressSteps = [
      { step: 'Extracting text...', progress: 20 },
      { step: 'Analyzing structure...', progress: 40 },
      { step: 'Identifying skills...', progress: 60 },
      { step: 'Processing experience...', progress: 80 },
      { step: 'Generating insights...', progress: 100 }
    ]

    for (const { step, progress } of progressSteps) {
      setParsingProgress(progress)
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Parse the actual resume
    return await resumeParser.parseResume(file)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setParsedData(null)
    setUploadProgress(0)
    setParsingProgress(0)
  }

  const getFileIcon = (file: File) => {
    const type = file.type
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />
    if (type.includes('word') || type.includes('document')) return <FileText className="h-8 w-8 text-blue-500" />
    if (type.includes('text')) return <FileText className="h-8 w-8 text-gray-500" />
    return <File className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Your Resume
          </CardTitle>
          <CardDescription>
            Upload your resume in PDF, Word, or text format. Our AI will analyze it to find the best job matches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
                ${isDragActive || dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} disabled={isLoading} />
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    or click to browse files
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Word
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Text
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Maximum file size: 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(uploadedFile)}
                  <div>
                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={isParsing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Parsing Progress */}
              {isParsing && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm font-medium">AI is analyzing your resume...</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing...</span>
                      <span>{parsingProgress}%</span>
                    </div>
                    <Progress value={parsingProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Brain className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-blue-600">AI Analysis</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-600">Skill Extraction</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-purple-600">Experience Analysis</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Sparkles className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                      <p className="text-xs text-orange-600">Insights Generation</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Parsed Results Preview */}
              {parsedData && (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Resume successfully analyzed! Found {parsedData.skills.length} skills and {parsedData.experience.length} work experiences.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Target className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Skills Found</p>
                            <p className="text-2xl font-bold text-blue-600">{parsedData.skills.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Briefcase className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Experience</p>
                            <p className="text-2xl font-bold text-green-600">{parsedData.experience.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <GraduationCap className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Education</p>
                            <p className="text-2xl font-bold text-purple-600">{parsedData.education.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Top Skills Identified:</h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills.slice(0, 10).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button className="flex-1">
                      <Zap className="h-4 w-4 mr-2" />
                      Find Matching Jobs
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-gray-600">
              Advanced NLP extracts skills, experience, and qualifications from your resume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Intelligent Matching</h3>
            <p className="text-sm text-gray-600">
              Find jobs that match your exact skills and experience level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Market Insights</h3>
            <p className="text-sm text-gray-600">
              Get detailed analytics on your market position and opportunities
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
