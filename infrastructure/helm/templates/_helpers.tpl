{{/* vim: set filetype=mustache: */}}

{{/*
### Expand chart name
*/}}
{{- define "custom-chart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
### Create chart name and version, used by the chart label
*/}}
{{- define "name-version.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
### Selector labels
*/}}
{{- define "selector.labels" -}}
app: {{ include "custom-chart.name" . }}
{{- if .Values.environment }}
environment: {{ .Values.environment | quote }}
{{- end }}
{{- end }}

{{/*
### Common labels
*/}}
{{- define "common.labels" -}}
name: {{ include "custom-chart.name" . }}
appVersion: {{ .Values.deployments.image.tag | quote }}
helm.sh/chart: {{ include "name-version.chart" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{ include "selector.labels" . }}
{{- end }}