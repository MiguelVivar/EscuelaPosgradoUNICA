import { useState, useEffect } from "react";
import Modal from "./Modal";
import UserFormFields from "./UserFormFields";
import Button from "@/components/common/Button";
import { UserFormData, UserFormModalProps } from "@/types/Admin";

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
}: UserFormModalProps) {
  const isEditMode = Boolean(editingUser);

  const [formData, setFormData] = useState<UserFormData>({
    nombres: "",
    apellidos: "",
    email: "",
    username: "",
    password: "",
    role: "POSTULANTE",
    dni: "",
    telefono: "",
    direccion: "",
    codigoEstudiante: "",
    codigoDocente: "",
    especialidad: "",
    programaInteres: "",
  });

  // Efecto para rellenar el formulario cuando se abre para editar
  useEffect(() => {
    if (editingUser && isOpen) {
      setFormData({
        nombres: editingUser.nombres || "",
        apellidos: editingUser.apellidos || "",
        email: editingUser.email || "",
        username: editingUser.username || "",
        role: editingUser.role,
        dni: editingUser.dni || "",
        telefono: editingUser.telefono || "",
        direccion: editingUser.direccion || "",
        codigoEstudiante: editingUser.codigoEstudiante || "",
        codigoDocente: editingUser.codigoDocente || "",
        especialidad: editingUser.especialidad || "",
        programaInteres: editingUser.programaInteres || "",
      });
    } else if (!editingUser && isOpen) {
      // Limpiar formulario para crear nuevo usuario
      setFormData({
        nombres: "",
        apellidos: "",
        email: "",
        username: "",
        password: "",
        role: "POSTULANTE",
        dni: "",
        telefono: "",
        direccion: "",
        codigoEstudiante: "",
        codigoDocente: "",
        especialidad: "",
        programaInteres: "",
      });
    }
  }, [editingUser, isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (
      !formData.nombres ||
      !formData.apellidos ||
      !formData.email ||
      !formData.username ||
      !formData.dni
    ) {
      return;
    }

    // Validación del DNI (8 dígitos)
    if (formData.dni && (formData.dni.length !== 8 || !/^\d{8}$/.test(formData.dni))) {
      alert("El DNI debe tener exactamente 8 dígitos");
      return;
    }

    if (!isEditMode && !formData.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <UserFormFields
          formData={formData}
          isEditMode={isEditMode}
          onChange={handleFieldChange}
        />

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200 mt-4">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 w-full sm:w-auto order-2 sm:order-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {isEditMode ? "Actualizar Usuario" : "Crear Usuario"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
