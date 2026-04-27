-- CreateIndex
CREATE INDEX "audit_logs_userId_timestamp_idx" ON "audit_logs"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "encounters_patientId_status_idx" ON "encounters"("patientId", "status");

-- CreateIndex
CREATE INDEX "flowsheet_observations_encounterId_recordedAt_idx" ON "flowsheet_observations"("encounterId", "recordedAt");

-- CreateIndex
CREATE INDEX "medication_administrations_orderId_administrationTime_idx" ON "medication_administrations"("orderId", "administrationTime");

-- CreateIndex
CREATE INDEX "orders_encounterId_status_orderType_idx" ON "orders"("encounterId", "status", "orderType");
